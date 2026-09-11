# Noeti site

Public marketing site for Noeti. Same layout as the retreat template — three models:

| Model | Price | For |
|-------|-------|-----|
| Solo | €20 / month | You |
| Desk | €60 / month | A small team |
| Studio | €200 / month | A larger floor |

```bash
npm install
npm run dev
```

Live: **[streboreziert.github.io/noeti-site](https://streboreziert.github.io/noeti-site/)**

The public copy is the `docs/` folder (GitHub Pages). After changing the site:

```bash
VITE_BASE=/noeti-site/ npm run build
rm -rf docs && mkdir docs && cp -R dist/. docs/ && touch docs/.nojekyll
```

