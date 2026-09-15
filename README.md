# Noeti site

Public marketing site for Noeti — physical AI trained on circuits. Three plans, one model:

| Plan | Price | Usage | Live projects |
|------|-------|-------|---------------|
| Solo | €20 / month | 2M | 1 |
| Lab | €60 / month | 10M | 3 |
| Company | €200 / month | 40M | 10 |

## Where things are

- `src/components/scope/` — the live oscilloscope: `waveforms.ts` (the five fault scenarios: expected vs measured trace, candidates, the named fault), `ScopeCanvas.tsx` (phosphor screen), `useScopeSequence.ts` (measure → search → named loop), `LiveScope.tsx` (HUD). Add a scenario by appending to `scenarios`.
- `src/components/Process.tsx` — the scrollytelling "Measure. Compare. Prove. Repeat." section.
- `src/components/motion/` — reusable motion: `Reveal`, `TextReveal`, `Counter`, `TiltCard`, `Magnetic`, `ScrollProgress`, `PageTransition`, `ParallaxBanner`.
- `src/data/models.ts` — plan copy and limits.
- `scripts/gen-images-circuit.py` — regenerates the board render and scope-screen imagery in `src/assets/` (needs Pillow + numpy). Swap in real photos by replacing the files.

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

