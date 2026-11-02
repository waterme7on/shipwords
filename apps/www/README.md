# shipwords landing

The one-page website for this shipwords fork, deployed at `shipwords.yololab.cc`. It explains the fleet model, previews a keyword site, and links to the Tiny Desk AI example. Static pages live in `public/` and ship as Workers static assets; the small Worker in `src/worker.ts` only proxies `/stats/*`.

Two languages: English at `/` (`public/index.html`) and Chinese at `/zh/` (`public/zh/index.html`). Both share `home.css` and `home.js`; keep the two pages in sync and their hreflang links pointing at each other.

```bash
pnpm --filter @shipwords/www dev           # local preview
pnpm --filter @shipwords/www run deploy    # manual deploy, only when CI is unavailable
```

Pushes to `main` deploy through Cloudflare Workers Builds. The build installs the pnpm workspace at the repo root, runs `check:public`, then deploys this Worker.

Analytics stays off on this copy. `public/analytics.js` is host-gated to the upstream `shipwords.dev` deployment, and the privacy pages state that this copy collects nothing.
