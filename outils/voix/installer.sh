#!/usr/bin/env bash
# Installe la voix off locale : environnement Python, voix Supertonic 3 et modèle de retranscription.
# Usage : bash outils/voix/installer.sh
set -euo pipefail
cd "$(dirname "$0")"
M="${VOIX_MODELES:-.modeles}"
mkdir -p "$M"
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip -q install sherpa-onnx soundfile numpy
B=https://github.com/k2-fsa/sherpa-onnx/releases/download
for u in "$B/tts-models/sherpa-onnx-supertonic-3-tts-int8-2026-05-11.tar.bz2" "$B/asr-models/sherpa-onnx-whisper-turbo.tar.bz2"; do
  d="$M/$(basename "$u" .tar.bz2)"
  [ -d "$d" ] || { curl -fL --retry 4 "$u" | tar -xj -C "$M"; }
done
echo "Voix installée dans $(pwd)/$M"
