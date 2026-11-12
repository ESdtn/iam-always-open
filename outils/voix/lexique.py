"""Applique le lexique de prononciation (voix/lexique.json) à un texte."""
import json
import re
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent.parent
lexique = json.loads((RACINE / "voix" / "lexique.json").read_text(encoding="utf-8"))
REGLES = [(re.compile(r"(?<!\w)(?:" + motif + r")(?!\w)", re.I), remplacement) for motif, remplacement in lexique["remplacements"]]


def phonetique(texte):
    for motif, remplacement in REGLES:
        texte = motif.sub(remplacement, texte)
    return texte
