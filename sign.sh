#!/usr/bin/env bash
# Produces packaged artifacts in dist/:
#   - dist/fullhex-<version>.crx  (Chrome, self-signed CRXv3 via mkcrx.js)
#   - dist/fullhex-<version>.xpi  (Firefox package; manifest at zip root)
#
# The .crx is signed with a local RSA key (fullhex-key.pem) generated on first
# run and reused thereafter so the extension ID stays stable. Keep that key
# private (it is gitignored). No browser is required; signing is done in Node.
#
# Firefox release-channel signing is performed by Mozilla's AMO service and
# requires API credentials, so it is NOT done here. The .xpi this produces is
# unsigned: installable as a temporary add-on, in Dev/Nightly/ESR with
# xpinstall.signatures.required=false, or uploadable to AMO to be signed.
set -euo pipefail
cd "$(dirname "$0")"

# Runtime files that go in the package (manifest must stay at the package root).
FILES=(manifest.json content.js content.css page.js)
KEY="fullhex-key.pem"

# Syntax-check before packaging so we never ship a broken build.
node -c content.js
node -c page.js
python3 -m json.tool manifest.json > /dev/null

VERSION=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
mkdir -p dist

# Generate the signing key once; reuse it to keep a stable extension ID.
if [ ! -f "$KEY" ]; then
  echo "Generating signing key $KEY (keep this private)"
  openssl genrsa -out "$KEY" 2048 2>/dev/null
fi

# Stage only the runtime files, then zip with manifest at the root. The same
# zip is both the .xpi and the payload wrapped inside the .crx.
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
cp "${FILES[@]}" "$WORK/"
ZIP="$WORK/fullhex.zip"
( cd "$WORK" && zip -q -X "$ZIP" "${FILES[@]}" )

CRX="dist/fullhex-${VERSION}.crx"
XPI="dist/fullhex-${VERSION}.xpi"
node mkcrx.js "$KEY" "$ZIP" "$CRX"
cp -f "$ZIP" "$XPI"

echo "---"
echo "Signed:   $CRX   (key: $KEY)"
echo "Packaged: $XPI   (unsigned; sign via AMO for release)"
