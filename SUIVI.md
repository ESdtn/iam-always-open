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
| « Man ou zone ? » | Validée par le coach, trois prononciations corrigées |
| Cover 0 | Validée par le coach (habillage et rythme), trois prononciations corrigées |
| Cover 1 | Première version rendue, en attente de l'avis du coach |
| Cover 3 | Première version rendue, en attente de l'avis du coach |
| Cover 2 | Première version rendue, en attente de l'avis du coach |
| Cover 4 | Première version rendue, en attente de l'avis du coach |
| Conclusion et quiz | Première version rendue, en attente de l'avis du coach |
| Fusion en une seule vidéo | À faire |

## Avancement par vidéo

| # | Vidéo | Script | Texte de voix | Audio | Calage | Animation | Rendu | Validé |
|---|---|---|---|---|---|---|---|---|
| 0 | Introduction | Relu | Fait | Fait | Fait | Fait | Fait | Oui |
| 1 | Man ou zone ? | Relu | Fait | Fait | Fait | Fait | Fait | Oui |
| 2 | Cover 0 | Relu | Fait | Fait | Fait | Fait | Fait | Oui |
| 3 | Cover 1 | Relu | Fait | Fait | Fait | Fait | Fait (v1) | |
| 4 | Cover 3 | Relu | Fait | Fait | Fait | Fait | Fait (v1) | |
| 5 | Cover 2 | Relu | Fait | Fait | Fait | Fait | Fait (v1) | |
| 6 | Cover 4 | Relu | Fait | Fait | Fait | Fait | Fait (v1) | |
| 7 | Conclusion et quiz | Relu | Fait | Fait | Fait | Fait | Fait (v1) | |

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

1. **Cover 1, Cover 3, Cover 2, Cover 4 et la conclusion** : avis du coach, avec les relevés de `videos/voix/` (`03-cover-1` à `07-conclusion-quiz`).
2. **Termes anglais nouveaux** à écouter. Cover 1 : « robber » (« robeur »), « out » (« a-outte »), « comeback » (« comme-bac »), « mesh » (« mèch »), « slots » (« slottes »). Cover 3 : « flat » (« flatt »), « curl » (« keurl »), « seam » (« sim »), « hitch » (« hitsh »). Cover 2 : « hashes » (« hachiz »), « smash » (« smach »), « Tampa 2 ». Cover 4 : « quarters » (« couarteurz »), « post » (« pôste »), « play-action » (« plé-akcheune »).
3. **Prises douteuses à l'oreille**, que la retranscription automatique n'a pas su confirmer. Cover 4, phrase « Un : la zone courte ». Conclusion, phrases « Compte les safeties » et « Lis le défenseur du flat ».
4. **Points tactiques à valider** : liste en bas de `scripts/README.md`.
5. **Fusion des huit vidéos** en une seule, une fois les chapitres validés.

## Journal

- **12 novembre 2026.** Lecture du guide, recherche tactique et vérification des outils. Écriture des sept scripts, puis ajout de « Man ou zone ? » à la demande du coach. Création de l'identité visuelle et de quatre images de référence. Comparatif des voix gratuites, choix de Supertonic M3, premiers essais de prononciation. Anonymisation du guide PDF et réécriture de l'historique git. Deuxième version de l'identité visuelle, sur trois nouvelles références, validée. Mise en place de la chaîne de production (voix avec sélection automatique de la meilleure prise, moteur de scène, HyperFrames) et premier rendu de l'introduction : 89 secondes.
- **12 novembre 2026, suite.** Retours du coach sur le pilote : accent anglophone, pas de pause aux virgules, MOFC et MOFO à retirer. Cause de l'accent trouvée : le réglage de langue n'était pas transmis au moteur de voix, qui lisait tout en anglais. Voix refaite en français, avec pauses à la ponctuation et prises reproductibles. Sigles retirés des scripts, des visuels et de l'animation. Deuxième rendu de l'introduction : 1 min 42.
- **12 novembre 2026, fin.** Introduction validée par le coach. Production de « Man ou zone ? » : 43 phrases, neuf scènes, 2 min 25.
- **12 novembre 2026, nuit.** Production du chapitre Cover 0 : 43 phrases, neuf scènes, 2 min 14. Premier chapitre avec l'habillage complet (titre, pastilles, progression).
- **Suite.** Gabarit de chapitre et rythme validés par le coach. Prononciations corrigées : quarterback, rushers, touchdown ; les quatorze phrases concernées régénérées et les trois premières vidéos re-rendues. Production de Cover 1 : 39 phrases, neuf scènes, 2 min 29.
- **Suite.** Production de Cover 3 : 41 phrases, dix scènes, 2 min 32.
- **Suite.** Production de Cover 2 : 40 phrases, dix scènes, 2 min 31.
- **Suite.** Production de Cover 4 : 43 phrases, neuf scènes, 2 min 31. Production de la conclusion et du quiz : 54 phrases, douze scènes, 3 min 15, avec six situations à deviner (trois secondes avant le snap, deux secondes de jeu, trois secondes pour répondre) et un carton de fin. Les huit vidéos de la série existent en première version ; durée totale : un peu moins de 20 minutes.
