# Noeti site

Public marketing site for Noeti — physical AI trained on circuits. Three plans, one model:

| Plan | Price | Usage | Live projects |
|------|-------|-------|---------------|
| Solo | €20 / month | 2M | 1 |
| Lab | €60 / month | 10M | 3 |
| Company | €200 / month | 40M | 10 |

Repo: [streboreziert/noeti-site](https://github.com/streboreziert/noeti-site)

- **Live:** https://noeticompute.com — `./push-noeticompute.sh`
- **Pages backup:** https://streboreziert.github.io/noeti-site/ — `./push-live.sh` then commit `docs/` and `git push origin main`

Full rules: `/Users/robertstreize/Desktop/Noeti/AGENTS.md`

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
