# Lexique de prononciation

**Voix retenue : Supertonic 3, voix M3, vitesse 1,10.**

Règle du coach : les termes de football se prononcent à l'anglaise, les numéros en français.

## Pourquoi un lexique

La voix lit du français. Avec l'orthographe anglaise normale, elle déraille : le mot anglais sort mal et les mots français autour sont déformés (« le safety reste deep » devient « le safety rest deep », « garde le hook » devient « gardley hook »). Avec une écriture phonétique à la française, la phrase reste propre.

Les scripts gardent donc l'orthographe normale, et ce lexique est appliqué au texte juste avant la synthèse. La version lue par l'outil est `voix/lexique.json` ; ce fichier-ci en est l'explication.

## Limite

Je ne peux pas écouter les fichiers. L'état ci-dessous vient d'une retranscription automatique : « reconnu » veut dire que le logiciel a retrouvé le bon mot anglais, pas que l'accent est bon. **C'est ton oreille qui valide.**

## Lexique

| Terme | Écriture donnée à la voix | État |
|---|---|---|
| Cover | Coveur | Reconnu |
| safety | séfti | Reconnu |
| corner | corneur | Reconnu |
| slot | slotte | Reconnu |
| snap | snap | Reconnu |
| blitz | blitz | Reconnu |
| quarterback | couarteurbac | Reconnu |
| running back | reuning-bac | Reconnu |
| linebacker | laïnebakeur | Reconnu |
| nickel | nikeul | Reconnu |
| deep | dip | Reconnu |
| hook | houque | Validé par le coach (fichier D, phrase 2) |
| flat | flatt | Reconnu |
| quarters | couarteurz | Reconnu |
| play-action | plé-akcheune | Reconnu |
| smash | smach | Reconnu |
| mesh | mèch | Reconnu |
| slant | slannt | Reconnu |
| curl | keurl | Reconnu |
| comeback | comme-bac | Reconnu |
| dig | digue | Reconnu |
| post | pôste | Reconnu |
| out | a-outte | **À confirmer.** Les quatre phrases du fichier D ont été refusées, mais la même écriture passe dans « quick out ». Je soupçonne « dix yards », mal prononcé dans ces phrases |
| quick out | couic a-outte | Validé par le coach (fichier D, phrase 9) |
| MOFC | mofsi | Validé par le coach (« MOFSI », à la française) |
| MOFO | mofo | Validé par le coach (à la française) |
| robber | robeur | Pas signalé par le coach |
| seam | sim | Pas signalé par le coach |
| fade | feïde | Validé par le coach (fichier C, phrase 2) |
| hitch | hitsh | Pas signalé par le coach |
| jam | jame | Pas signalé par le coach |
| press | presse | Pas signalé par le coach |
| man | man | Pas signalé par le coach |
| yards | yardz | Corrigé par le coach |
| dix yards | di yardz | Corrigé par le coach. Même règle pour « six yards » |
| 2-Man | deux mane | Validé par le coach (fichier D, phrase 14) |

Numéros : écrits en toutes lettres, en français (« Coveur trois », « la Tampa deux », « la Coveur six »).

Retour du coach après écoute des fichiers A, B et C : seuls hook, out, quick out et 2-Man sonnent faux. Après le fichier D : hook, quick out et 2-Man sont réglés, « out » seul reste à confirmer.

## Fichiers d'écoute

Dans `essais/`, voix M3, vitesse normale.

**`prononciation_M3_A_orthographe-normale.wav` et `prononciation_M3_B_phonetique.wav`** : les dix mêmes phrases, dans cet ordre. A avec l'orthographe normale, B avec le lexique.

1. Cover trois. Le safety reste deep, au milieu.
2. Le linebacker garde le hook, le nickel garde le flat.
3. Le robber coupe le croisement. Le slot attaque la seam.
4. Le receveur court un slant, un hitch, un out, ou une fade.
5. Un curl à dix yards, un comeback, un post, un dig, un corner.
6. Le quarterback lit le corner sur le smash. Le running back reste en protection.
7. Au snap, le corner joue en press et met un jam. C'est un blitz.
8. Milieu fermé : MOFC. Milieu ouvert : MOFO.
9. Deux slots se croisent : c'est le mesh. En play-action, on attaque les quarters.
10. Un quick out. (A : Man ou zone ? / B : La première question : man ou zone ?)

**`prononciation_M3_C_variantes.wav`** : huit phrases pour départager les mots douteux.

1. « fade » écrit féde
2. « fade » écrit feïde
3. « out » écrit out, « yards » écrit yards
4. « out » écrit aoute, « yards » écrit yardz
5. « quick out » écrit kouik aoute
6. « quick out » écrit couik-aout
7. Coveur zéro, un, deux, trois, quatre
8. La Tampa deux, la deux-man, la Coveur six

**`vitesse_M3_x1.00.wav`, `x1.10` et `x1.20`** : la première phrase de l'introduction à trois vitesses. Le coach a retenu 1,10.

**`prononciation_M3_D_mots-a-corriger.wav`** : seize phrases numérotées à voix haute, à la vitesse 1,10. Quatre écritures pour chacun des quatre mots refusés.

| Numéros | Mot | Écritures, dans l'ordre |
|---|---|---|
| 1 à 4 | hook | houc, houque, hook, ouk |
| 5 à 8 | out | a-outte, aotte, aoutt, awte |
| 9 à 12 | quick out | couic a-outte, kwik aotte, quick aoutt, couik awte |
| 13 à 16 | 2-Man | deux man, deux mane, deux mèn, deux manne |

## Ce que tu peux me renvoyer

Le plus simple désormais : écouter la vidéo, et me donner l'instant et le mot qui sonne faux, par exemple « 0:38, yards ». Je corrige l'écriture dans `lexique.json` et je régénère la phrase.
