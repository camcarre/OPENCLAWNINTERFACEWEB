#!/bin/bash
# Description: Automate Marp conversion to HTML/PDF

INPUT_FILE=$1
OUTPUT_NAME=$(basename "$INPUT_FILE" .md)

if [ -z "$INPUT_FILE" ]; then
    echo "Usage: marp_auto_build.sh <file.md>"
    exit 1
fi

echo "Conversion de $INPUT_FILE en cours..."
# Utilise le skill marp-cli installé
# (Note: le binaire marp doit être accessible ou via npx)
npx @marp-team/marp-cli "$INPUT_FILE" -o "${OUTPUT_NAME}.html"
npx @marp-team/marp-cli "$INPUT_FILE" --pdf -o "${OUTPUT_NAME}.pdf"

echo "Terminé. Fichiers créés: ${OUTPUT_NAME}.html, ${OUTPUT_NAME}.pdf"
