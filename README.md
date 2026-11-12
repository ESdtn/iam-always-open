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
| `videos/` | À venir : une composition par vidéo, son audio et son rendu |

## Chaîne de production d'une vidéo

1. **Script** validé par le coach (`scripts/NN-titre.md`).
2. **Texte de voix** : la voix off du script, passée au lexique de prononciation (`voix/lexique.md`).
3. **Audio** : synthèse scène par scène avec la voix retenue, puis écoute et corrections.
4. **Calage** : alignement mot à mot de l'audio, qui donne le minutage de chaque scène et les sous-titres.
5. **Animation** : composition en code avec le kit de `identite-visuelle/`, calée sur l'audio.
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
| Animation et rendu | HyperFrames (HTML, GSAP, FFmpeg) | À installer dans le dépôt au premier rendu |
| Voix off | Supertonic 3, voix M3, en local | Testé |
| Calage et sous-titres | Parakeet TDT v3 via sherpa-onnx | Testé |
| Images de référence | `node identite-visuelle/render.cjs` (Chromium) | En place |
