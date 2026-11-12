"""Écrit le relevé d'une vidéo : tout le texte prononcé, phrase par phrase, avec son minutage.

Usage : python3 outils/voix/releve.py 00-introduction
Lit videos/assets/audio/<id>.timing.js et videos/voix/<id>.json, écrit videos/voix/<id>.releve.md.
Le relevé sert au coach pour noter ce qui ne va pas, à l'écoute de la vidéo.
"""
import json
import sys
from pathlib import Path

from lexique import RACINE, phonetique

ident = sys.argv[1]
brut = (RACINE / "videos" / "assets" / "audio" / f"{ident}.timing.js").read_text(encoding="utf-8")
minutage = json.loads(brut[brut.index("{"):brut.rindex("}") + 1])
plan = json.loads((RACINE / "videos" / "voix" / f"{ident}.json").read_text(encoding="utf-8"))
forces = {p.get("id"): p.get("dit") or phonetique(p["lu"]) for s in plan["scenes"] for p in s["phrases"] if p.get("dit") or p.get("lu")}
TITRES = {"accroche": "Accroche", "promesse": "La promesse", "question": "La première question", "etapes": "La lecture en trois étapes",
          "conflit": "Le défenseur en conflit", "plan": "Le plan de la série", "titre": "Titre", "familles": "Deux familles",
          "pourquoi": "Pourquoi ça change tout", "indices": "Les indices avant le snap", "preuve": "La preuve au snap",
          "receveur": "Ce que ça change pour le receveur", "quarterback": "Ce que ça change pour le quarterback",
          "rangees": "Les cinq couvertures, rangées", "reflexe": "Le réflexe", "identite": "Carte d'identité",
          "reconnaitre": "La reconnaître", "faiblesses": "Ses faiblesses", "battre-qb": "La battre, côté quarterback",
          "battre-wr": "La battre, côté receveur", "battre": "La battre", "croisement": "Le croisement, et la fade",
          "confondre": "Ne pas confondre", "curl": "Le curl, côté receveur", "verticaux": "Quatre verticaux", "piege": "Le piège",
          "duel": "Le duel extérieur", "mesh": "Le mesh", "smash": "Le défenseur en conflit : le smash", "smash-wr": "Le smash, côté receveurs", "milieu": "Le milieu profond", "variante": "La variante",
          "court": "Prendre ce qu'elle donne", "hitch": "Le hitch, côté receveur", "post": "Attirer le safety", "arbre": "L'arbre de lecture", "joueurs": "Un joueur à lire par couverture",
          "quiz": "Le quiz", "variantes": "Trois variantes", "cloture": "Clôture"}


def temps(t):
    return f"{int(t // 60)}:{t % 60:04.1f}"


lignes = [f"# Relevé de la voix · {ident}", "",
          f"Durée : {temps(minutage['duree'])}. Voix M3, en français, vitesse 1,10, pause à chaque virgule et à chaque deux-points.", "",
          "Chaque ligne est une phrase prononcée. La colonne « Donné à la voix » montre l'écriture phonétique quand elle diffère du texte.",
          "Note dans la dernière colonne ce qui ne va pas : un mot mal prononcé, un débit trop rapide, une pause trop courte, une intonation bizarre.", ""]
n = 0
for scene in minutage["scenes"]:
    lignes += [f"## {TITRES.get(scene['id'], scene['id'])} ({temps(scene['t0'])} à {temps(scene['t1'])})", "",
               "| N° | Début | Texte | Donné à la voix | Remarque |", "|---|---|---|---|---|"]
    for p in scene["phrases"]:
        n += 1
        dit = forces.get(p["id"]) or phonetique(p["texte"])
        lignes.append(f"| {n} | {temps(p['t0'])} | {p['texte']} | {dit if dit != p['texte'] else '—'} | |")
    lignes.append("")
(RACINE / "videos" / "voix" / f"{ident}.releve.md").write_text("\n".join(lignes), encoding="utf-8")
print(f"{n} phrases")
