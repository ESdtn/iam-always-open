# iam-always-open

Série de vidéos en motion design pour apprendre à un quarterback et à ses receveurs à lire les couvertures défensives : reconnaître la couverture, trouver l'espace, savoir où va le ballon.

Huit vidéos, environ 24 minutes : introduction, man ou zone, Cover 0, Cover 1, Cover 3, Cover 2, Cover 4, conclusion et quiz. Les concepts sont génériques ; le dépôt est public et ne contient ni nom de club ni jeu maison.

L'avancement et les décisions sont dans [`SUIVI.md`](SUIVI.md).

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `sources/` | Le guide PDF de départ |
| `recherche/` | Compléments tactiques tirés du web, avec les sources et leur niveau de confiance |
| `scripts/` | Un script par vidéo (voix off et description de l'écran), conventions communes |
| `identite-visuelle/` | Couleurs, typographies, kit de dessin du terrain, images de référence |
| `voix/` | Comparatif des voix, lexique de prononciation, essais audio |
| `videos/` | Un projet HyperFrames par vidéo (`videos/NN-titre/`), le texte de voix (`videos/voix/`) et les ressources partagées (`videos/assets/`) : kit de dessin, moteur de scène, polices, audio |
| `outils/voix/` | Synthèse de la voix off et minutage |

## Chaîne de production d'une vidéo

1. **Script** validé par le coach (`scripts/NN-titre.md`).
2. **Texte de voix** : la voix off du script, passée au lexique de prononciation (`voix/lexique.md`).
3. **Audio** : synthèse phrase par phrase avec la voix retenue, puis écoute et corrections.
4. **Calage** : la synthèse produit le minutage de chaque phrase et les sous-titres.
5. **Animation** : composition en code avec le kit et le moteur de scène de `videos/assets/`, calée sur le minutage.
6. **Rendu** en 1920 × 1080, puis vérification image par image des moments clés.
7. **Validation** par le coach, corrections, rendu final.

## Règles de la série

- **Continuité.** Chaque vidéo commence et finit sur le même état neutre (terrain, attaque en formation de base, aucune défense), image identique au pixel près. La première image d'une vidéo est la dernière de la précédente, ce qui permet de les fusionner sans raccord.
- **Audio d'abord.** L'animation se cale sur la voix, jamais l'inverse.
- **Une couleur, un sens.** Orange pour ce que l'attaque doit faire, bleu pour la défense, jaune pour le joueur que le quarterback lit.
- **Man ou zone partout.** Chaque chapitre affiche sa pastille et rappelle la règle : man, je cours ; zone, je m'assieds dans le trou.

## Outils

Tout tourne dans une session cloud Claude Code, sans installation locale.

| Besoin | Outil | État |
|---|---|---|
| Animation et rendu | HyperFrames 0.9.39 (HTML, GSAP, FFmpeg) | En place |
| Voix off | Supertonic 3, voix M3, en local, en français | En place |
| Calage et sous-titres | Minutage phrase par phrase, produit par la synthèse | En place |
| Images de référence | `node identite-visuelle/render.cjs` (Chromium) | En place |

## Produire une vidéo

```bash
bash outils/voix/installer.sh
```

```bash
outils/voix/.venv/bin/python outils/voix/synthese.py videos/voix/00-introduction.json
```

```bash
cd videos && npm install
```

```bash
cd videos/00-introduction && npx --yes hyperframes@0.9.39 check --no-craft
```

```bash
cd videos/00-introduction && npx --yes hyperframes@0.9.39 render -o ../rendus/00-introduction.mp4
```

La synthèse découpe chaque phrase à la ponctuation pour y placer une pause, génère chaque morceau avec plusieurs graines et garde la prise la mieux retranscrite. Elle écrit l'audio, les sous-titres et le minutage dans `videos/assets/audio/`, range les prises retenues dans `videos/voix/prises/`, et reporte la durée dans la composition. Seules les phrases modifiées sont régénérées.

Le relevé à faire relire au coach se produit avec `python3 outils/voix/releve.py 00-introduction`, depuis `outils/voix/`.

Les rendus (`videos/rendus/`) ne sont pas versionnés : ils se régénèrent à l'identique à partir du dépôt.
