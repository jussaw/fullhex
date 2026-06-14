# FullHex — Privacy Policy site

A tiny self-hosted Next.js app that serves the privacy policy for the **FullHex** Chrome
extension. It exists because the Chrome Web Store requires a publicly reachable Privacy Policy
URL before the extension can be published.

It is a single static page (one route at `/`). No database, no API routes, no analytics, no
client-side JS beyond what Next.js ships by default.

Public URL: **https://fullhex.jussaw.com** — this is the string to paste into the Chrome Web
Store Developer Dashboard's "Privacy Policy URL" field.

## Project structure

```
privacy-policy/
├── web/      # the Next.js application
└── devops/   # deploy.sh
```

## Run locally

```bash
cd web
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts: `pnpm build` / `pnpm start` (production), `pnpm lint`, `pnpm format`.

## Deploy

On the server (Docker required):

```bash
devops/deploy.sh
```

This pulls the latest commit, rebuilds the image, and runs the container bound to host port
**23414** (`23414:3000`). Point the reverse proxy for `fullhex.jussaw.com` at
`127.0.0.1:23414`.
