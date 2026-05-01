# SIGNBRIDGE-VIDEOS

## Run locally

```bash
npm install
npm start
```

## Other useful commands

```bash
npm run build
npm run preview
npm run lint
npm run format
```

## Deploy to Render

Recommended: deploy as a **Static Site** (this repo builds to static files in `dist/`).

If you use the Render dashboard (no IaC):

- Service type: **Static Site**
- Build command: `npm run build`
- Publish directory: `dist`
- Add a rewrite rule for SPA routing: `/*` -> `/index.html`

If you use Infrastructure-as-Code, this repo includes `render.yaml`.

## Notes

- This project uses Vite for development/build, but `npm start` is now the standard dev command (same idea as many "typical" React setups).
- If you specifically want to migrate away from Vite (e.g., to `react-scripts`/CRA or another bundler), tell me which target you want and why; CRA is outdated and will likely require downgrading from React 19.
