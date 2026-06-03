#!/usr/bin/env bash
# Packages the extension into dist/fullhex-<version>.zip
# for Chrome Web Store / Firefox AMO submission. No deps beyond node, python3, zip.
set -euo pipefail
cd "$(dirname "$0")"

# Runtime files that go in the package (manifest must stay at the zip root).
FILES=(manifest.json content.js content.css page.js)

# Syntax-check before packaging so we never ship a broken build.
node -c content.js
node -c page.js
python3 -m json.tool manifest.json > /dev/null

VERSION=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
OUT="dist/fullhex-${VERSION}.zip"

mkdir -p dist
rm -f "$OUT"
zip -j "$OUT" "${FILES[@]}"

echo "---"
echo "Built $OUT"
