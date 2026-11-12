# Voix off : comparatif des solutions gratuites

État au 12 novembre 2026. Besoin : voix masculine en français, fluide, pour environ 17 000 caractères de script (50 000 avec les reprises), dans un texte qui mélange français et termes anglais de football.

## Limites de ce comparatif

- **Personne n'a écouté les essais.** Les jugements de qualité viennent de classements publics, de retours de tiers et d'une retranscription automatique des fichiers générés. Le classement ci-dessous reste à confirmer à l'oreille.
- **Les sites officiels n'étaient pas lisibles en direct** depuis la session (hors GitHub). Les quotas et les prix viennent de résumés de recherche et de sources tierces, parfois contradictoires.
- **Aucune API à clé n'a été testée**, faute de compte.

## Classement

| # | Solution | Type | Voix masculine FR | Limite du gratuit | Licence | Timings par mot | Ce qu'il faut |
|---|---|---|---|---|---|---|---|
| 1 | Gemini 3.1 Flash TTS (Google AI Studio) | API | Oui, 30 voix multilingues | Quota non publié, entre 10 et 100 requêtes par jour selon les sources. Un script par requête suffit | Sortie libre d'usage, données du gratuit utilisées pour l'entraînement | Non | Un compte Google et une clé, sans carte. Domaine déjà ouvert |
| 2 | Supertonic 3 (Supertone) | Local, CPU | Oui, 5 voix (M1 à M5) | Illimité, sans compte | Code MIT, poids OpenRAIL-M. Dépôt archivé en septembre 2026 | Non | Rien, déjà testé ici |
| 3 | Azure Speech, palier F0 | API | Oui, une dizaine (Henri, Rémy, Lucien...) | 500 000 caractères par mois | Non vérifiée | Oui | Un compte Azure, carte peut-être exigée |
| 4 | edge-tts (non officiel) | API sans clé | Oui (Henri, Rémy) | Pas de quota publié, erreurs signalées | Aucune licence d'usage, zone grise | Oui | Ouvrir `speech.platform.bing.com` |
| 5 | ElevenLabs, palier gratuit | API | Oui | 10 000 caractères par mois : deux mois pour toute la série | Pas d'usage commercial, attribution exigée | Oui | Un compte, ouvrir `api.elevenlabs.io` |
| 6 | Piper (voix `tom`, `pierre`) | Local, CPU | Oui | Illimité | Variable selon la voix (AGPL, CC BY-SA) | Expérimental | Rien, déjà testé ici |

**Écartés.** Kokoro et MeloTTS (voix française féminine seulement), Voxtral de Mistral (seule voix française féminine, pas de gratuit confirmé), OpenAI (pas de gratuit), Kyutai TTS 1.6B (carte graphique obligatoire), Pocket TTS, Chatterbox, Phonon et Qwen3-TTS (poids sur un domaine fermé, non testés), Cartesia, Hume et Gradium (gratuit réservé à l'usage non commercial, quotas serrés), Fish Audio (conditions contradictoires, fin du gratuit annoncée).

## Recommandation

1. **Premier choix : Gemini 3.1 Flash TTS.** Il est deuxième du classement public Artificial Analysis, devant ElevenLabs v3, et son palier gratuit donne le même modèle que le payant. Il n'a pas été testé ici : il faut une clé.
2. **Plan B, disponible tout de suite : Supertonic 3.** La retranscription automatique retrouve la phrase de test sans faute sur les cinq voix, « Cover 3 », « safety » et « corners » compris. Sur une autre phrase, « slot » est sorti « slow » et « un hitch » « un niche » : il faudra réécrire quelques termes phonétiquement.
3. **Timings par mot.** Aucun des deux n'en fournit. L'alignement après coup a été testé avec succès sur un essai Supertonic (Parakeet TDT v3, via sherpa-onnx).

**Écart avec le payant.** Avec Gemini, il n'y en a pas sur la qualité, seulement sur le quota et l'usage des données. Supertonic et Piper sont très probablement en dessous (inférence, pas mesure). À titre de repère, 50 000 caractères coûteraient environ 5 $ chez ElevenLabs et 2 $ chez Gemini en payant, d'après des sources tierces.

## Essais

Même phrase pour tous : « Cover 3. Même safety au milieu, mais cette fois, c'est de la zone. Trois défenseurs se partagent la profondeur, un tiers chacun : les deux corners et le safety du milieu. »

| Fichier dans `essais/` | Retranscription automatique |
|---|---|
| `supertonic3_M1_homme.wav` à `supertonic3_M5_homme.wav` | Phrase exacte |
| `piper_fr_FR-tom-medium_homme.wav` | « Covet 3 … les deux cornets » |
| `piper_fr_FR-tom-medium_homme_texte-reecrit-coveur-corneurs.wav` | Correcte une fois le texte réécrit « Coveur trois … corneurs » |
| `piper_fr_FR-upmc-medium_pierre_homme.wav` | « Covey 3 … cornets » |
| `piper_fr_FR-gilles-low_homme.wav` | « s'efflit », « corneille » |
| `coqui_vits_fr-css10_homme.wav` | « safetti », « corneille », le « 3 » est sauté |
| `mms_tts_fra.wav` | Mauvaise, chiffres et ponctuation sautés |
| `kokoro_*_bricolage.wav` | Voix italienne détournée sur des phonèmes français, pour mémoire |

À écouter en priorité : `supertonic3_M2`, `M3` et `M5`, les plus graves.
