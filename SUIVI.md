# Suivi du projet

Dernière mise à jour : 12 novembre 2026.

## Où on en est

| Étape | État |
|---|---|
| Organisation de la série | Fait |
| Recherche complémentaire | Fait |
| Scripts | Écrits et validés par le coach |
| Identité visuelle et images de référence | Validée par le coach (terrain en gazon) |
| Choix de la voix | Fait : Supertonic 3, voix M3 |
| Prononciation et vitesse de la voix | Voix corrigée (elle lisait en mode anglais), pauses à la ponctuation ; termes anglais à réécouter |
| Installation de l'outil de rendu | Fait : HyperFrames, un projet par vidéo |
| Vidéo pilote (introduction) | Validée par le coach |
| Autres vidéos | À faire |
| Fusion en une seule vidéo | À faire |

## Avancement par vidéo

| # | Vidéo | Script | Texte de voix | Audio | Calage | Animation | Rendu | Validé |
|---|---|---|---|---|---|---|---|---|
| 0 | Introduction | Relu | Fait | Fait | Fait | Fait | Fait | Oui |
| 1 | Man ou zone ? | Relu | | | | | | |
| 2 | Cover 0 | Relu | | | | | | |
| 3 | Cover 1 | Relu | | | | | | |
| 4 | Cover 3 | Relu | | | | | | |
| 5 | Cover 2 | Relu | | | | | | |
| 6 | Cover 4 | Relu | | | | | | |
| 7 | Conclusion et quiz | Relu | | | | | | |

## Décisions prises

| Sujet | Décision |
|---|---|
| Format | Horizontal 16:9, 1920 × 1080 |
| Contenu | Concepts génériques, aucun jeu maison |
| Anonymat | Dépôt public : aucun nom de club ni de joueur |
| Périmètre | Cinq couvertures, variantes citées en conclusion |
| Ordre | Man ou zone, puis Cover 0, 1, 3, 2, 4 |
| Vocabulaire | « Milieu fermé » et « milieu ouvert », en français. Les sigles MOFC et MOFO sont abandonnés |
| Prononciation | Termes de football à l'anglaise, numéros en français |
| Visuel | Identité « Le tableau du coach » : ardoise pour les titres, terrain en gazon de −20 à +25 yards |
| Voix | Synthèse gratuite et locale : Supertonic 3, voix M3, en français, vitesse 1,10 |
| Pauses | Une pause à chaque virgule (0,26 s) et à chaque deux-points (0,40 s) |
| Guide PDF | Conservé dans le dépôt, nom du club effacé ; historique git réécrit |
| Schémas | Dessinés en code, pas générés par IA |

## Points ouverts

1. **Pilote, deuxième version** : avis du coach, avec le relevé `videos/voix/00-introduction.releve.md`.
2. **Termes anglais** : tous à réécouter, la voix ayant changé (voir `voix/lexique.md`).
3. **Débit** : vitesse 1,10 avec pauses. À confirmer.
4. **Points tactiques à valider** : liste en bas de `scripts/README.md`.

## Journal

- **12 novembre 2026.** Lecture du guide, recherche tactique et vérification des outils. Écriture des sept scripts, puis ajout de « Man ou zone ? » à la demande du coach. Création de l'identité visuelle et de quatre images de référence. Comparatif des voix gratuites, choix de Supertonic M3, premiers essais de prononciation. Anonymisation du guide PDF et réécriture de l'historique git. Deuxième version de l'identité visuelle, sur trois nouvelles références, validée. Mise en place de la chaîne de production (voix avec sélection automatique de la meilleure prise, moteur de scène, HyperFrames) et premier rendu de l'introduction : 89 secondes.
- **12 novembre 2026, suite.** Retours du coach sur le pilote : accent anglophone, pas de pause aux virgules, MOFC et MOFO à retirer. Cause de l'accent trouvée : le réglage de langue n'était pas transmis au moteur de voix, qui lisait tout en anglais. Voix refaite en français, avec pauses à la ponctuation et prises reproductibles. Sigles retirés des scripts, des visuels et de l'animation. Deuxième rendu de l'introduction : 1 min 42.
