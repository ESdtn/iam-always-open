"""Génère la voix off d'une vidéo et le minutage qui va avec.

Usage : outils/voix/.venv/bin/python outils/voix/synthese.py videos/voix/00-introduction.json

Entrée : un fichier JSON qui liste les scènes et leurs phrases, avec l'orthographe normale.
Sorties, dans videos/assets/audio/ :
  <id>.mp3        la voix off complète
  <id>.timing.js  le minutage de chaque scène et de chaque phrase, chargé par la composition
  <id>.srt        les sous-titres
La durée est aussi reportée dans les attributs data-duration de videos/<id>/index.html.

Prononciation. La voix lit en français. Le lexique (voix/lexique.json) réécrit les termes anglais de football
en phonétique française juste avant la synthèse. Une phrase peut porter :
  "lu"   le texte à lire quand il diffère du sous-titre (ponctuation voulue par le coach), encore passé au lexique ;
  "dit"  l'écriture exacte donnée à la voix, sans passer par le lexique.

Attention, piège de la bibliothèque : il faut écrire g.extra = {...} en entier. g.extra["lang"] = "fr" modifie
une copie et n'a aucun effet, et la voix lit alors tout en anglais.

Pauses. Cette voix ne s'arrête pas sur les virgules. Chaque phrase est donc découpée à la ponctuation
(virgule, deux-points, point-virgule), chaque morceau est généré à part, et une vraie pause est insérée entre eux.

Fiabilité. Le même texte peut sortir bien ou mal selon la graine aléatoire. Chaque morceau est généré avec
jusqu'à ESSAIS graines, retranscrit sans imposer la langue, et on garde la prise la plus fidèle : une prise
lue avec un accent étranger se retranscrit mal et se trouve écartée. Les graines sont fixes, donc le résultat
est reproductible.

Prises. La prise retenue pour chaque phrase est rangée dans videos/voix/prises/<id>/. Une phrase n'est régénérée
que si son écriture, sa vitesse ou les pauses changent, ou si on la nomme : REFAIRE=a1,p3 ... Les phrases
validées par le coach restent donc identiques d'une version à l'autre. Pour obtenir d'autres prises d'une
phrase qui sort mal, changer les graines : REFAIRE=x2 DECALAGE=100 ESSAIS=10 ...
"""
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata
import zlib
from pathlib import Path

import numpy as np
import sherpa_onnx as so
import soundfile as sf

from lexique import RACINE, lexique, phonetique

ICI = Path(__file__).resolve().parent
MODELES = Path(os.environ.get("VOIX_MODELES", ICI / ".modeles"))
SORTIE = RACINE / "videos" / "assets" / "audio"
PAUSES = lexique.get("pauses", {",": 0.26, ":": 0.4, ";": 0.4})
CHIFFRES = {"0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq", "6": "six", "10": "dix"}


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
        tokens=str(d / "turbo-tokens.txt"), language="", task="transcribe", num_threads=4)


def dire(voix, texte, vitesse, graine):
    g = so.GenerationConfig()
    g.sid, g.num_steps, g.speed = lexique["sid"], 16, vitesse
    g.extra = {"lang": "fr", "seed": str(graine)}
    a = voix.generate(texte, g)
    x = np.array(a.samples, dtype=np.float32)
    # On retire le silence de début et de fin : les pauses sont décidées ici, pas par la voix.
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


def normaliser(texte):
    texte = re.sub(r"\d+", lambda m: CHIFFRES.get(m.group(), m.group()), texte.lower())
    texte = "".join(c for c in unicodedata.normalize("NFD", texte) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", texte).strip()


def ressemblance(a, b):
    return difflib.SequenceMatcher(None, normaliser(a), normaliser(b)).ratio()


def morceaux(texte):
    """Découpe une phrase après chaque virgule, deux-points ou point-virgule."""
    return [m for m in re.split(r"(?<=[,;:])\s+", texte.strip()) if m] or [texte]


def prise_phrase(voix, reco, texte, dit, vitesse, essais):
    """Génère une phrase morceau par morceau. Renvoie (audio, fréquence, score, retranscription)."""
    parts, attendus = morceaux(dit), morceaux(texte)
    # Quand le texte normal a la même ponctuation, chaque morceau est noté contre le sien ; sinon contre son écriture.
    reperes = attendus if len(attendus) == len(parts) else parts
    audio, sr = [], None
    for i, (part, repere) in enumerate(zip(parts, reperes)):
        meilleure = None
        base = zlib.crc32(part.encode("utf-8")) % 100000 + int(os.environ.get("DECALAGE", "0"))
        for essai in range(essais):
            x, sr = dire(voix, part, vitesse, base + essai)
            score = ressemblance(repere, retranscrire(reco, x, sr))
            if meilleure is None or score > meilleure[1]:
                meilleure = (x, score)
            if score >= 0.9:
                break
        audio.append(meilleure[0])
        pause = PAUSES.get(part.rstrip()[-1], 0)
        if pause and i < len(parts) - 1:
            audio.append(np.zeros(int(pause * sr), dtype=np.float32))
    x = np.concatenate(audio)
    entendu = retranscrire(reco, x, sr)
    return x, sr, ressemblance(texte, entendu), entendu


def horodatage(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"


def main():
    plan = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    vitesse = plan.get("vitesse", lexique["vitesse"])
    essais = int(os.environ.get("ESSAIS", "6"))
    refaire = set(filter(None, os.environ.get("REFAIRE", "").split(",")))
    dossier = RACINE / "videos" / "voix" / "prises" / plan["id"]
    dossier.mkdir(parents=True, exist_ok=True)
    registre_f = dossier / "prises.json"
    registre = json.loads(registre_f.read_text(encoding="utf-8")) if registre_f.exists() else {}
    voix = reco = None

    blocs, scenes, sr, t = [], [], None, 0.0

    def silence(duree):
        nonlocal t
        if duree > 0:
            blocs.append(np.zeros(int(round(duree * sr)), dtype=np.float32))
            t += int(round(duree * sr)) / sr

    for scene in plan["scenes"]:
        phrases = []
        for i, p in enumerate(scene["phrases"]):
            ident = p.get("id", f"{scene['id']}-{i + 1}")
            dit, v = p.get("dit") or phonetique(p.get("lu") or p["texte"]), p.get("vitesse", vitesse)
            fiche, fichier = registre.get(ident), dossier / f"{ident}.flac"
            garde = fiche and fichier.exists() and ident not in refaire and fiche["dit"] == dit and fiche["vitesse"] == v \
                and (len(morceaux(dit)) == 1 or fiche.get("pauses") == PAUSES)
            if garde:
                x, sr_p = sf.read(fichier, dtype="float32")
                note = "gardée"
            else:
                if voix is None:
                    voix, reco = charger_voix(), charger_retranscription()
                x, sr_p, score, entendu = prise_phrase(voix, reco, p["texte"], dit, v, essais)
                sf.write(fichier, x, sr_p)
                registre[ident] = {"dit": dit, "vitesse": v, "pauses": PAUSES, "score": round(score, 2), "entendu": entendu}
                note = f"{score:.2f} {'  ' if score >= 0.85 else '!!'} {entendu}"
            if sr is None:
                sr = sr_p
                silence(plan.get("debut", 0.0))
            silence(p.get("avant", 0.0))
            t0 = t
            blocs.append(x)
            t += len(x) / sr
            phrases.append({"id": ident, "t0": round(t0, 3), "t1": round(t, 3), "texte": p["texte"]})
            print(f"{ident:>6} {t0:7.2f} {t - t0:5.2f}s {note}", flush=True)
            silence(p.get("pause", plan.get("pause_phrase", 0.28)))
        silence(scene.get("pause", plan.get("pause_scene", 0.7)))
        scenes.append({"id": scene["id"], "t0": phrases[0]["t0"], "t1": phrases[-1]["t1"], "phrases": phrases})
    silence(plan.get("fin", 0.0))
    registre_f.write_text(json.dumps(registre, ensure_ascii=False, indent=1), encoding="utf-8")

    SORTIE.mkdir(parents=True, exist_ok=True)
    audio = np.concatenate(blocs)
    audio = audio / max(np.max(np.abs(audio)), 1e-6) * 0.89
    wav = SORTIE / f"{plan['id']}.wav"
    sf.write(wav, audio, sr, subtype="PCM_16")
    # MP3 pour le dépôt et le rendu : dix fois plus léger que le WAV.
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "2", "-b:a", "192k", str(wav.with_suffix(".mp3"))], check=True)
    wav.unlink()
    duree = round(len(audio) / sr, 2)
    timing = {"id": plan["id"], "duree": duree, "scenes": scenes}
    (SORTIE / f"{plan['id']}.timing.js").write_text(
        "// Généré par outils/voix/synthese.py. Ne pas modifier à la main.\nwindow.MINUTAGE = " + json.dumps(timing, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    srt, n = [], 0
    for sc in scenes:
        for p in sc["phrases"]:
            n += 1
            srt.append(f"{n}\n{horodatage(p['t0'])} --> {horodatage(p['t1'])}\n{p['texte']}\n")
    (SORTIE / f"{plan['id']}.srt").write_text("\n".join(srt), encoding="utf-8")
    # La composition doit durer exactement autant que la voix.
    composition = RACINE / "videos" / plan["id"] / "index.html"
    if composition.exists():
        html = composition.read_text(encoding="utf-8")
        composition.write_text(re.sub(r'data-duration="[0-9.]+"', f'data-duration="{duree}"', html), encoding="utf-8")
    print(f"{plan['id']} : {duree:.1f} s, {n} phrases")


if __name__ == "__main__":
    main()
