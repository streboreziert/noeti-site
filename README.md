# Noeti website

Marketing site. Vite + React. Plans: **Solo €20 · Lab €60 · Company €200**.

Repo: [streboreziert/noeti-site](https://github.com/streboreziert/noeti-site)
Live: **https://streboreziert.github.io/noeti-site/**

This folder is `/Users/robertstreize/Desktop/Noeti/website`. Company tree: `../` (`AGENTS.md`).

## Local

```bash
cd /Users/robertstreize/Desktop/Noeti/website
npm install
npm run dev
```

Dev server: http://localhost:8080

## Push live

GitHub Pages serves **`docs/`** on **`main`**. The site is under `/noeti-site/`, so the build base path must be set.

```bash
cd /Users/robertstreize/Desktop/Noeti/website

VITE_BASE=/noeti-site/ npm run build
rm -rf docs && mkdir docs && cp -R dist/. docs/ && touch docs/.nojekyll

git add -A
git commit -m "Ship site"
git push origin main
```

Same steps: `./push-live.sh` (does not commit). Then commit and push `docs/`.

A minute later the site is live. Do not commit `node_modules/` or `dist/`.
