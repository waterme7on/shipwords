# Tiny Desk AI (demo)

A full Tiny Desk-style shipwords site at `https://app.shipwords.yololab.cc`.

- **What it is**: the complete site flow — email sign-in, credits, account/orders, upload one to five photos, a queued generation job, and a delivered video. The UI and code are forked from `sites/tinydeskai-example`.
- **This build is a demo**: `UPSTREAM_MOCK=1` returns a fixed AI-generated dog-band clip, `STRIPE_SECRET_KEY` is a test placeholder, and checkout is disabled in the UI. A verified signup gets 20 credits (two mock videos).
- **Media**: the stage, dog portraits, posters and mock video are AI-generated placeholders. Replace them with rights-cleared footage, a song and a real stage before enabling paid rendering.
- **No compose container in this build**: the mock path does not need ffmpeg or Workers Paid containers. To switch to real Kling/Pruna compose, restore the container config from `sites/tinydeskai-example` and add the real model keys.

## Local

```bash
pnpm install
cd sites/tiny-desk-ai
pnpm db:generate && pnpm db:migrate:local
pnpm dev
```

Secrets live outside the repo. See `.dev.vars.example`; the mock video is keyed in R2 as `assets/tinydesk/mock-result.mp4`.

## Deploy

Production deploys from `main` through Cloudflare Workers Builds. The build installs the workspace, runs `check:public`, then runs `pnpm --filter @shipwords/site-tiny-desk-ai run deploy`.

Resources: D1 `tiny-desk-ai`, R2 `tiny-desk-ai-outputs`, Workflow `tiny-desk-ai-generation`, custom domain `app.shipwords.yololab.cc`, sender `noreply@yololab.cc`, support `support@yololab.cc`.
