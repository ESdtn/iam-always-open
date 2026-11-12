# Lexique de prononciation

**Voix retenue : Supertonic 3, voix M3, en français, vitesse 1,10.**

Règle du coach : les termes de football se prononcent à l'anglaise, les numéros et tout le reste en français.

## Comment ça marche

- **La voix lit en français.** Les mots français s'écrivent normalement.
- **Les termes anglais passent par un lexique.** Chacun a une écriture phonétique à la française (`voix/lexique.json`), appliquée au texte juste avant la synthèse. Les scripts et les sous-titres gardent l'orthographe normale.
- **La voix s'arrête sur la ponctuation.** Chaque phrase est découpée à la virgule, au deux-points et au point-virgule ; un silence est inséré entre les morceaux (0,26 s après une virgule, 0,40 s après un deux-points).
- **Chaque morceau est généré plusieurs fois**, puis retranscrit automatiquement sans imposer la langue. On garde la prise la plus fidèle au texte : une prise lue avec un accent étranger se retranscrit mal et se trouve écartée.

## Ce qui a changé le 12 novembre 2026

Jusqu'à la première version du pilote, la voix lisait tout en **mode anglais** sans que personne le sache : le réglage « français » était écrit d'une façon que la bibliothèque ignore. C'est ce qui donnait l'accent anglophone sur des phrases entièrement françaises, et ce qui obligeait à réécrire des mots comme « presque », « étapes » ou « zone ».

Le réglage est corrigé. Conséquences :

- les mots français n'ont plus besoin d'écriture spéciale, et celles proposées par le coach pour compenser (« presk », « étappe », « zaune », « regardé », « nesspasse », « Troua ») ont été retirées ;
- la ponctuation voulue par le coach est conservée (par exemple une virgule après « Un » ou après « tout ») ;
- **tous les termes anglais sont à réécouter** : ils avaient été validés avec l'ancienne voix.

## Lexique des termes anglais

| Terme | Écriture donnée à la voix | État |
|---|---|---|
| Cover | Coveur | À réécouter |
| safety, safeties | séfti | À réécouter |
| corner | corneur | À réécouter |
| slot | slotte | À réécouter |
| quarterback | kouateurbak | Écriture donnée par le coach |
| running back | reuning-bac | À réécouter |
| linebacker | laïnebakeur | À réécouter |
| nickel | nikeul | À réécouter |
| man | manne | Écriture proposée par le coach |
| 2-Man | deux mane | À réécouter |
| deep | dip | À réécouter |
| hook | houque | À réécouter |
| flat | flatt | À réécouter |
| seam | sim | À réécouter |
| quarters | couarteurz | À réécouter |
| play-action | plé-akcheune | À réécouter |
| smash | smach | À réécouter |
| mesh | mèch | À réécouter |
| slant | slannt | À réécouter |
| curl | keurl | À réécouter |
| hitch | hitsh | À réécouter |
| out | a-outte | À réécouter |
| quick out | couic a-outte | À réécouter |
| comeback | comme-bac | À réécouter |
| dig | digue | À réécouter |
| post | pôste | À réécouter |
| fade | feïde | À réécouter |
| robber | robeur | À réécouter |
| jam | jame | À réécouter |
| press | presse | À réécouter |
| yards | yardz | À réécouter |
| dix yards, six yards | di yardz, si yardz | À réécouter |
| quiz | couize | Écriture proposée par le coach |
| motion | mocheune | Nouveau, à écouter dans « Man ou zone ? » |
| rushers | rusher | Écriture donnée par le coach. « six rushers, parfois plus » est lu « si rusher, parfoi plusse » |
| touchdown | teutchdaoun | Écriture donnée par le coach |

Laissés tels quels : snap, blitz. Numéros en toutes lettres et en français : « Coveur trois », « la Tampa deux », « la Coveur six ».

Les sigles MOFC et MOFO ne sont plus utilisés : on dit « milieu fermé » et « milieu ouvert ».

## Corriger une prononciation

Chaque vidéo a son relevé (`videos/voix/NN-titre.releve.md`) : toutes les phrases, leur minutage, et l'écriture donnée à la voix. Le coach y note ce qui ne va pas.

Trois réglages possibles dans le texte de voix (`videos/voix/NN-titre.json`) :

| Champ | Effet |
|---|---|
| une entrée dans `voix/lexique.json` | Change l'écriture d'un terme dans toutes les vidéos |
| `"lu"` sur une phrase | Texte à lire quand il diffère du sous-titre, par exemple pour ajouter une virgule. Passe encore par le lexique |
| `"dit"` sur une phrase | Écriture exacte donnée à la voix, sans passer par le lexique |

Seules les phrases modifiées sont régénérées : les prises validées sont conservées dans `videos/voix/prises/`.

## Anciens essais

Les fichiers de `essais/` (vitesses, phrases A, B, C et D) datent d'avant la correction et sont lus en mode anglais. Ils ne reflètent plus la voix actuelle.
