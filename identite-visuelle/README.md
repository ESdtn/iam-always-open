# Identité visuelle · « Le tableau du coach »

L'identité part de trois images d'inspiration fournies par le coach. Elles ne sont pas stockées dans le dépôt : ce sont des visuels de tiers, on n'en reprend que l'esprit.

| Image d'inspiration | Ce qu'on en garde | Où ça sert |
|---|---|---|
| Tableau noir, craie blanche, orange, titre en script et en slab italique | Fond d'ardoise texturé, gribouillis X et O à la craie, hachures orange, duo de typos | Titres, cartons de chapitre, cartes « réflexe » |
| Terrain vert vu de dessus, lignes blanches, X et O blancs | Gazon sombre avec bandes de tonte et vignette, lignes de 5 yards, hashes, croix blanches pour la ligne défensive, anneaux pour la ligne offensive | Le terrain |
| Schéma de playbook : pastilles lettrées, tracés colorés, ligne de mêlée bleue, grands chiffres couchés | Joueurs en disques avec la lettre du poste, défense en sombre, joueur clé en couleur, tracés finis par une flèche ou une barre, ligne de mêlée bleue, chiffres en filigrane | Tout ce qui se joue sur le terrain |

L'idée : l'ardoise habille la série, le gazon porte le contenu tactique.

## Images de référence

Rendues en 1920 × 1080 par `node identite-visuelle/render.cjs`, à partir de `reference/index.html`.

| Fichier | Rôle |
|---|---|
| `reference/01-titre.png` | Titre de la série |
| `reference/02-neutre.png` | État neutre : première et dernière image de chaque vidéo |
| `reference/03-identite.png` | Plan large, carte d'identité d'une couverture |
| `reference/04-lecture-large.png` | Plan large, lecture du quarterback |
| `reference/05-lecture-serre.png` | Plan serré sur la même lecture |
| `reference/06-reflexe.png` | Carte « réflexe » de fin de chapitre |

## Cadrage

- **Plan large** : de −20 à +25 yards sur toute la hauteur, 24 pixels par yard. Le terrain occupe la bande centrale (1280 pixels), les marges hors-jeu de 320 pixels portent l'habillage.
- **Plan serré** : la caméra zoome sur la zone qui compte (42 pixels par yard dans la référence). L'habillage passe dans un panneau flottant.
- La caméra est un simple réglage du kit (échelle et origine) : le passage du large au serré s'anime.

## Couleurs

| Rôle | Nom | Valeur |
|---|---|---|
| Terrain | Gazon, gazon clair (bandes de tonte) | `#1f5a2b`, `#246331` |
| Hors-jeu, marges | Hors-jeu | `#143d1e` |
| Lignes, attaque | Blanc | `#ffffff` |
| Ligne de mêlée | Bleu ligne | `#3ea0ee` |
| Défense | Ardoise cerclée de blanc | `#1d1e20` |
| Tracé gagnant, mot clé, titres | Orange | `#ff8a1f` |
| Défenseur lu, regard du QB, zones courtes, pastille ZONE | Jaune | `#ffc400` |
| Zones profondes | Ciel | `#9fd4f5` |
| Pastille MAN | Bleu | `#2b8fd6` |
| Contre-exemple, erreur | Rouge | `#ff5a5f` |
| Fond des titres et des cartes | Ardoise | `#1d1e20` |
| Texte sur ardoise | Craie | `#f2efe9` |

Règle d'usage : une couleur, un sens. L'orange désigne toujours ce que l'attaque doit faire, le jaune toujours le joueur que le quarterback lit.

## Typographies

| Usage | Police | Licence |
|---|---|---|
| Titres (« COVER 3 », « COUVERTURE ») | Alfa Slab One, inclinée de 10° | OFL 1.1 |
| Mots d'accroche (« Lire la », « La battre », « Le réflexe ») | Kaushan Script | OFL 1.1 |
| Étiquettes, pastilles, lettres des joueurs | Barlow Condensed 600 et 700 | OFL 1.1 |
| Sous-titres et texte courant | Barlow 500 et 600 | OFL 1.1 |
| Annotations manuscrites | Permanent Marker | Apache 2.0 |

Les fichiers sont dans `videos/assets/fonts/`, chargés en local pour que le rendu ne dépende pas du réseau.

## Le terrain

- **Repère** : x en yards depuis la touche gauche (0 à 53,33), y en yards depuis la ligne de mêlée, positif vers la défense.
- **Marquage** : ligne blanche tous les 5 yards, repère tous les yards sur les hashes et le long des touches, grands chiffres couchés à 10 et 20 yards de la ligne de mêlée, échelle +5 à +20 dans la marge gauche.
- **Attaque** : disques blancs avec la lettre du poste. Ligne offensive en anneaux blancs, centre en carré.
- **Défense** : disques ardoise cerclés de blanc avec le poste (CB, FS, SS, N, LB). Ligne défensive en croix blanches.
- **Défenseur lu** : disque jaune, double anneau jaune, étiquette jaune « DÉFENSEUR EN CONFLIT », cône jaune translucide depuis le quarterback.
- **Zones** : ellipses translucides, ciel pour les profondes, jaune pour les courtes, nom en capitales.
- **Tracés** : trait orange épais. Il finit par une **flèche** quand le receveur continue de courir, par une **barre** quand il s'arrête. C'est la distinction man ou zone, visible sur chaque schéma. Le tracé secondaire est à demi-opacité.
- **Déplacement d'un défenseur** : pointillés blancs fins.
- **Vol du ballon** : pointillés blancs, avec le ballon dessus.

## Habillage

- **Marge gauche** : titre du chapitre, pastilles (MAN ou ZONE, nombre de safeties, MOFC ou MOFO), étape en cours en script, puis la règle de lecture ou le compteur de la scène.
- **Marge droite** : progression dans le chapitre (l'étape en cours en orange) et légende.
- **Sous-titres** : en bas du terrain, sur un bandeau sombre, la partie importante en orange.
- **Cartes « réflexe »** : sur ardoise, deux cartes côte à côte, onglet orange QB et WR.

## Fichiers

- `../videos/assets/tokens.css` : couleurs, typographies et classes de base.
- `../videos/assets/kit.js` : fonctions de dessin (ardoise, gribouillis, terrain avec caméra, joueurs, zones, tracés, cône de lecture). Les vidéos s'en servent directement.
- `../videos/assets/fonts/` : les polices, chargées en local.
- `render.cjs` : rend les images de référence.
