# Identité visuelle · « Le tableau du coach »

L'identité part de deux images d'inspiration fournies par le coach. Elles ne sont pas stockées dans le dépôt : ce sont des visuels de tiers, on n'en reprend que l'esprit.

| Image d'inspiration | Ce qu'on en garde | Où ça sert |
|---|---|---|
| Tableau noir, craie blanche, orange, titre en script et en slab italique | Fond d'ardoise texturé, gribouillis X et O à la craie, hachures orange, duo de typos | Titres, cartons de chapitre, cartes « réflexe », marges |
| Porte-bloc tenu à deux mains, X bleus, O gris, flèches arrondies, pince jaune | Le porte-bloc comme scène, défense en bleu, attaque en cercles, flèches à pointe ouverte, jaune d'accent | Le terrain et tout ce qui s'y joue |

L'idée : l'ardoise habille la série, le porte-bloc porte le contenu tactique.

## Images de référence

Rendues en 1920 × 1080 par `node identite-visuelle/render.cjs`, à partir de `reference/index.html`.

| Fichier | Rôle |
|---|---|
| `reference/01-titre.png` | Titre de la série |
| `reference/02-terrain-clair.png` | Scène de terrain, version porte-bloc (recommandée) |
| `reference/03-terrain-ardoise.png` | La même scène, version tout ardoise |
| `reference/04-reflexe.png` | Carte « réflexe » de fin de chapitre |

**Décision à prendre : terrain clair ou terrain ardoise.** Je recommande le clair. Sur un vidéoprojecteur en salle éclairée, un fond sombre perd son contraste et les zones translucides deviennent illisibles ; la feuille claire reste nette. Elle fait aussi le lien avec le guide PDF que les joueurs connaissent déjà.

## Couleurs

| Rôle | Nom | Valeur |
|---|---|---|
| Fond | Ardoise | `#1d1e20` |
| Cartes sur fond | Ardoise claire | `#2a2b2e` |
| Cadre du porte-bloc | Cadre | `#3f4042` |
| Feuille du porte-bloc | Papier | `#fbfaf6` |
| Texte et traits sur ardoise | Craie | `#f2efe9` |
| Texte et traits sur papier | Encre | `#2a2b2d` |
| Tracé gagnant, mot clé, titres | Orange | `#f5821f` |
| Défense | Bleu | `#2b8fd6` |
| Défenseur en conflit, regard du QB | Jaune | `#ffb400` |
| Zones profondes | Ciel | `#8ecbf0` |
| Zones courtes | Jaune, en aplat translucide | `#ffb400` à 20 % |
| Contre-exemple, erreur | Rouge | `#e5484d` |

Règle d'usage : une couleur, un sens. L'orange désigne toujours ce que l'attaque doit faire, le bleu toujours la défense, le jaune toujours le joueur que le QB lit.

## Typographies

| Usage | Police | Licence |
|---|---|---|
| Titres (« COVER 3 », « COUVERTURE ») | Alfa Slab One, inclinée de 10° | OFL 1.1 |
| Mots d'accroche (« Lire la », « La battre », « Le réflexe ») | Kaushan Script | OFL 1.1 |
| Étiquettes, pastilles, lettres des joueurs | Barlow Condensed 600 et 700 | OFL 1.1 |
| Sous-titres et texte courant | Barlow 500 et 600 | OFL 1.1 |
| Annotations manuscrites | Permanent Marker | Apache 2.0 |

Les fichiers sont dans `fonts/`, chargés en local pour que le rendu ne dépende pas du réseau.

## Le terrain

- **Repère** : x en yards depuis la touche gauche (0 à 53,33), y en yards depuis la ligne de mêlée, positif vers la défense. Fenêtre affichée : de −6 à +20 yards, à 30 pixels par yard, soit 1600 × 780 pixels.
- **Attaque** : cercles à contour, lettre du poste au centre. Ligne offensive sans lettre, centre en carré.
- **Défense** : pastilles bleues pleines avec le poste (CB, FS, SS, N, LB). Ligne défensive en croix bleues.
- **Zones** : ellipses translucides, bleu ciel pour les profondes, jaune pour les courtes, nom en capitales.
- **Tracés** : trait orange épais, bouts ronds, pointe en chevron ouvert. Le tracé secondaire est à 45 % d'opacité.
- **Déplacement d'un défenseur** : pointillés bleus fins.
- **Lecture du QB** : cône jaune translucide du QB vers le défenseur lu, double anneau jaune autour de lui, étiquette jaune « DÉFENSEUR EN CONFLIT ».
- **Vol du ballon** : pointillés orange fins, avec le ballon dessus.
- **Règle de lecture** : deux étiquettes en bas à gauche, celle qui s'applique en orange plein, l'autre en contour gris.

## Habillage

- **Bandeau haut** : titre du chapitre et pastilles à gauche, étape en cours à droite (mot en script, précision en capitales grises).
- **Sous-titres** : sous le porte-bloc, centrés, Barlow 600 en 44 px, la partie importante en orange.
- **Marges** : quelques gribouillis à la craie à faible opacité, jamais sur le terrain.
- **Cartes « réflexe »** : deux cartes côte à côte, onglet orange QB et WR, condition en bleu ciel, action en craie avec le mot clé en orange.

## Fichiers

- `tokens.css` : couleurs, typographies et classes de base.
- `kit.js` : fonctions de dessin (fond d'ardoise, gribouillis, terrain, joueurs, zones, tracés, cône de lecture). Elles serviront telles quelles aux compositions vidéo.
- `render.cjs` : rend les images de référence.
