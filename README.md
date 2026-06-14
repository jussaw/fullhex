# FullHex

A tiny Manifest V3 browser extension (Chrome + Firefox) that removes the blank
blue ad-space gutters on [colonist.io](https://colonist.io) so the game board
fills the window.

Free colonist.io accounts reserve a 165px strip on each side of the board and a
90px strip on the bottom for ads. With an ad blocker the ads are stripped but the
reserved space stays blank blue. FullHex makes colonist collapse those gutters
and re-lay-out the board to full size — no background page, no extra permissions,
no UI.

## Repository layout

This repo holds two independent projects:

| Path | What it is |
| --- | --- |
| [`extension/`](extension/) | The browser extension itself — plain JS/CSS, no build step, no dependencies. This is the product. |
| [`privacy-policy/`](privacy-policy/) | A small self-hosted Next.js site that serves the extension's privacy policy, required for Chrome Web Store publishing. |

Each directory has its own README with full details:

- **[`extension/README.md`](extension/README.md)** — install, how it works, and
  build/packaging (`build.sh` / `sign.sh`).
- **[`privacy-policy/README.md`](privacy-policy/README.md)** — run locally and
  deploy the policy site (served at <https://fullhex.jussaw.com>).

The repo root holds only this file, `CLAUDE.md`, and `.gitignore`.

## Quick start

Load the extension unpacked — no build required:

- **Chrome / Edge / Brave:** `chrome://extensions` → enable **Developer mode** →
  **Load unpacked** → select the `extension/` folder.
- **Firefox:** `about:debugging#/runtime/this-firefox` → **Load Temporary
  Add-on…** → pick `extension/manifest.json`.

Then open colonist.io and start a game (reload any open colonist tab first). See
[`extension/README.md`](extension/README.md) for store-signed installs and
packaging.

## How it works (short version)

Colonist sizes the board in JavaScript, **not** from the ad DOM, so hiding the ad
`<div>`s does nothing. The board reserves hardcoded gutters whenever its
`showVerticalAds()` / `showHorizontalAds()` checks return true — and both return
false when `document.fullscreenElement` is truthy (colonist's own "fill the
window" path). The extension makes `document.fullscreenElement` read as truthy
without actually entering fullscreen, then dispatches a `resize` so colonist
recomputes the board at full width and height. Full write-up in
[`extension/README.md`](extension/README.md#how-it-works).

> Not affiliated with colonist.io.
