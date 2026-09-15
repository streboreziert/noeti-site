#!/usr/bin/env bash
# Rebuild docs/ for GitHub Pages. Does not commit or push.
set -euo pipefail
cd "$(dirname "$0")"
VITE_BASE=/noeti-site/ npm run build
rm -rf docs
mkdir docs
cp -R dist/. docs/
touch docs/.nojekyll
echo "docs/ rebuilt. Commit and: git push origin main"
echo "Live: https://streboreziert.github.io/noeti-site/"
