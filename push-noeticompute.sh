#!/usr/bin/env bash
# Ship the marketing SPA to https://noeticompute.com
# Does NOT touch the product backend. Does NOT use VITE_BASE=/noeti-site/
set -euo pipefail
cd "$(dirname "$0")"

REMOTE="${DEPLOY_REMOTE:-root@62.238.41.18}"
HTML="${DEPLOY_REMOTE_DIR:-/data/sites/noeticompute}/html"
CONTAINER="${DEPLOY_CONTAINER:-noetis-network}"

echo "→ Build SPA for https://noeticompute.com (base /)"
unset VITE_BASE || true
npm run build

echo "→ Sync SPA files to ${REMOTE}:${HTML} (keep existing product HTML)"
rsync -avz \
  dist/index.html dist/404.html dist/logo.svg dist/robots.txt dist/placeholder.svg dist/favicon.ico \
  "${REMOTE}:${HTML}/"
rsync -avz dist/assets/ "${REMOTE}:${HTML}/assets/"

echo "→ Copy into running container ${CONTAINER}"
ssh "${REMOTE}" "docker cp ${HTML}/index.html ${CONTAINER}:/app/html/index.html
docker cp ${HTML}/logo.svg ${CONTAINER}:/app/html/logo.svg
docker cp ${HTML}/robots.txt ${CONTAINER}:/app/html/robots.txt
docker cp ${HTML}/placeholder.svg ${CONTAINER}:/app/html/placeholder.svg
docker cp ${HTML}/favicon.ico ${CONTAINER}:/app/html/favicon.ico
docker cp ${HTML}/assets/. ${CONTAINER}:/app/html/assets/"

echo "→ Verify"
curl -sf --max-time 15 https://noeticompute.com | grep -q "The circuit exists\|Physical AI trained on circuits"
curl -sf --max-time 15 https://noeticompute.com/api/health | grep -q '"ok":true'
echo "Live: https://noeticompute.com"
echo "API OK"
