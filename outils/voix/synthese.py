"""Génère la voix off d'une vidéo, phrase par phrase, et le minutage qui va avec.

Usage : outils/voix/.venv/bin/python outils/voix/synthese.py videos/voix/00-introduction.json

Entrée : un fichier JSON qui liste les scènes et leurs phrases, avec l'orthographe normale.
Sorties, dans videos/assets/audio/ :
  <id>.mp3        la voix off complète
  <id>.timing.js  le minutage de chaque scène et de chaque phrase, chargé par la composition
  <id>.srt        les sous-titres
Le lexique de prononciation (voix/lexique.json) est appliqué au texte juste avant la synthèse.

La synthèse n'est pas déterministe : la même phrase peut sortir bien ou mal. Chaque phrase est donc
générée jusqu'à ESSAIS fois, retranscrite automatiquement, et on garde la prise la plus fidèle au texte.
Une phrase peut porter un champ "dit" pour forcer l'écriture donnée à la voix.
"""
import difflib
import unicodedata
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import sherpa_onnx as so
import soundfile as sf

from lexique import RACINE, lexique, phonetique

ICI = Path(__file__).resolve().parent
MODELES = Path(os.environ.get("VOIX_MODELES", ICI / ".modeles"))
SORTIE = RACINE / "videos" / "assets" / "audio"


def charger_voix():
    d = MODELES / "sherpa-onnx-supertonic-3-tts-int8-2026-05-11"
    modele = so.OfflineTtsSupertonicModelConfig(
        duration_predictor=str(d / "duration_predictor.int8.onnx"), text_encoder=str(d / "text_encoder.int8.onnx"),
        vector_estimator=str(d / "vector_estimator.int8.onnx"), vocoder=str(d / "vocoder.int8.onnx"),
        tts_json=str(d / "tts.json"), unicode_indexer=str(d / "unicode_indexer.bin"), voice_style=str(d / "voice.bin"))
    return so.OfflineTts(so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(supertonic=modele, num_threads=4)))


def charger_retranscription():
    d = MODELES / "sherpa-onnx-whisper-turbo"
    return so.OfflineRecognizer.from_whisper(
        encoder=str(d / "turbo-encoder.int8.onnx"), decoder=str(d / "turbo-decoder.int8.onnx"),
        tokens=str(d / "turbo-tokens.txt"), language="fr", task="transcribe", num_threads=4)


def dire(voix, texte, vitesse):
    g = so.GenerationConfig()
    g.sid, g.num_steps, g.speed = lexique["sid"], 16, vitesse
    g.extra["lang"] = "fr"
    a = voix.generate(texte, g)
    x = np.array(a.samples, dtype=np.float32)
    # On retire le silence de début et de fin : les pauses sont décidées par le script.
    fort = np.where(np.abs(x) > 0.012 * np.max(np.abs(x)))[0]
    marge = int(0.03 * a.sample_rate)
    return x[max(fort[0] - marge, 0):fort[-1] + marge], a.sample_rate


def retranscrire(reco, x, sr):
    # Une seconde de silence à la fin : sans elle, la retranscription avale les derniers mots.
    x = np.concatenate([x, np.zeros(sr, dtype=np.float32)])
    n = int(len(x) * 16000 / sr)
    x16 = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    s = reco.create_stream()
    s.accept_waveform(16000, x16)
    reco.decode_stream(s)
    return s.result.text.strip()


CHIFFRES = {"0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq", "6": "six", "10": "dix"}


def normaliser(texte):
    texte = re.sub(r"\d+", lambda m: CHIFFRES.get(m.group(), m.group()), texte.lower())
    texte = "".join(c for c in unicodedata.normalize("NFD", texte) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", texte).strip()


def meilleure_prise(voix, reco, texte, dit, vitesse, essais):
    """Renvoie (audio, fréquence, score, retranscription) de la prise la plus fidèle."""
    attendu, meilleure = normaliser(texte), None
    for _ in range(essais):
        x, sr = dire(voix, dit, vitesse)
        entendu = retranscrire(reco, x, sr)
        score = difflib.SequenceMatcher(None, attendu, normaliser(entendu)).ratio()
        if meilleure is None or score > meilleure[2]:
            meilleure = (x, sr, score, entendu)
        if score >= 0.93:
            break
    return meilleure


def horodatage(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"


def main():
    source = Path(sys.argv[1])
    essais = int(os.environ.get("ESSAIS", "6"))
    plan = json.loads(source.read_text(encoding="utf-8"))
    vitesse = plan.get("vitesse", lexique["vitesse"])
    voix = charger_voix()
    reco = charger_retranscription()

    morceaux, scenes, sr, t = [], [], None, 0.0

    def silence(duree):
        nonlocal t
        if duree > 0:
            morceaux.append(np.zeros(int(round(duree * sr)), dtype=np.float32))
            t += int(round(duree * sr)) / sr

    for scene in plan["scenes"]:
        phrases = []
        for i, p in enumerate(scene["phrases"]):
            x, sr_p, score, entendu = meilleure_prise(voix, reco, p["texte"], p.get("dit") or phonetique(p["texte"]), p.get("vitesse", vitesse), essais)
            if sr is None:
                sr = sr_p
                silence(plan.get("debut", 0.0))
            silence(p.get("avant", 0.0))
            t0 = t
            morceaux.append(x)
            t += len(x) / sr
            phrases.append({"id": p.get("id", f"{scene['id']}-{i + 1}"), "t0": round(t0, 3), "t1": round(t, 3), "texte": p["texte"]})
            print(f"{phrases[-1]['id']:>6} {t0:7.2f} {t - t0:5.2f}s {score:.2f} {'  ' if score >= 0.85 else '!!'} {entendu}", flush=True)
            silence(p.get("pause", plan.get("pause_phrase", 0.28)))
        silence(scene.get("pause", plan.get("pause_scene", 0.7)))
        scenes.append({"id": scene["id"], "t0": phrases[0]["t0"], "t1": phrases[-1]["t1"], "phrases": phrases})
    silence(plan.get("fin", 0.0))

    SORTIE.mkdir(parents=True, exist_ok=True)
    audio = np.concatenate(morceaux)
    audio = audio / max(np.max(np.abs(audio)), 1e-6) * 0.89
    wav = SORTIE / f"{plan['id']}.wav"
    sf.write(wav, audio, sr, subtype="PCM_16")
    # MP3 pour le dépôt et le rendu : dix fois plus léger que le WAV.
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "2", "-b:a", "192k", str(wav.with_suffix(".mp3"))], check=True)
    wav.unlink()
    timing = {"id": plan["id"], "duree": round(len(audio) / sr, 3), "scenes": scenes}
    (SORTIE / f"{plan['id']}.timing.js").write_text(
        "// Généré par outils/voix/synthese.py. Ne pas modifier à la main.\nwindow.MINUTAGE = " + json.dumps(timing, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    srt, n = [], 0
    for sc in scenes:
        for p in sc["phrases"]:
            n += 1
            srt.append(f"{n}\n{horodatage(p['t0'])} --> {horodatage(p['t1'])}\n{p['texte']}\n")
    (SORTIE / f"{plan['id']}.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"{plan['id']} : {timing['duree']:.1f} s, {n} phrases")


if __name__ == "__main__":
    main()
