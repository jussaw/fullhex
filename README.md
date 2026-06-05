# FullHex

A tiny browser extension that removes the blank blue ad-space gutters on
[colonist.io](https://colonist.io) so the game board fills the window.

Free colonist.io accounts reserve a 165px strip on each side of the board and a
90px strip on the bottom for ads. With an ad blocker the ads are stripped but the
reserved space stays blank blue. This extension makes colonist collapse those
gutters and re-lay-out the board to full size.

Pure content script — no background page, no extra permissions, no UI. Works on
both Chrome and Firefox.

## Files

- `manifest.json` — Manifest V3, content-script only.
- `content.js` — injects `page.js` into colonist's own JS context.
- `page.js` — the actual fix (runs in the page world).
- `content.css` — hides the ad strips to avoid a flash before the resize.
- `build.sh` / `sign.sh` / `mkcrx.js` — packaging (see **Build & package**).
- `store/` — store-listing copy (summary + description) for AMO submission.

## Install

### Chrome / Edge / Brave

1. Go to `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this folder.
4. Open colonist.io and start a game (reload any open colonist tab first).

### Firefox

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and pick this folder's `manifest.json`.
3. Open colonist.io and start a game.

> Temporary add-ons are removed when Firefox restarts. To keep it permanently,
> install a signed `.xpi` (see **Build & package** below) — release-channel
> Firefox only installs add-ons signed by Mozilla via addons.mozilla.org (AMO).

> The manifest also declares Firefox-for-Android support (`gecko_android`,
> min 142), so it runs on Android builds that allow add-ons (e.g. Nightly /
> debug installs).

## Build & package

Two scripts produce distributable artifacts in `dist/`. Both are dependency-light
(`node`, `python3`, `zip`, and `openssl` for signing) and need no `npm install`.

| Script | Output | Use |
| --- | --- | --- |
| `./build.sh` | `dist/fullhex-<version>.zip` | Upload to the Chrome Web Store / AMO for store distribution. |
| `./sign.sh` | `dist/fullhex-<version>.crx` and `.xpi` | Signed Chrome package + a Firefox package for local/self-distribution. |

```sh
./sign.sh
```

This syntax-checks the sources, then writes:

- **`dist/fullhex-<version>.crx`** — a self-signed CRXv3, built in Node by
  `mkcrx.js` (no browser required). It is signed with `fullhex-key.pem`, a local
  RSA key generated on first run and reused thereafter so the extension ID stays
  stable. **Keep `fullhex-key.pem` private and do not lose it** — it is gitignored,
  and regenerating it changes the extension ID.
- **`dist/fullhex-<version>.xpi`** — the Firefox package (a zip with
  `manifest.json` at the root). This is **not** AMO-signed: release-channel
  Firefox will not install it permanently. Your options:
  - Load it as a **temporary add-on** (`about:debugging` → Load Temporary Add-on).
  - Set `xpinstall.signatures.required` to `false` in `about:config` on
    **Developer Edition / Nightly / ESR**, then install the `.xpi` directly.
  - Upload the `.xpi` (or the `build.sh` zip) to
    [AMO](https://addons.mozilla.org) to have Mozilla sign it for release.

> Why a hand-rolled `mkcrx.js` instead of `chrome --pack-extension`? Chrome's
> packer crashes intermittently (`Trace/BPT trap`) when launched from a script,
> so the CRX3 container is assembled and signed directly in Node for a
> deterministic build.

## How it works

Colonist sizes the board in JavaScript, **not** from the ad DOM — so simply
hiding the ad `<div>`s does nothing (that was v1, and it had no effect). The board
reserves hardcoded gutters (`getInGameVerticalAdWidth()` → 165,
`getInGameHorizontalAdHeight()` → 90) whenever `showVerticalAds()` /
`showHorizontalAds()` return true.

Both of those return **false when `document.fullscreenElement` is truthy** — it's
colonist's own "fill the window" path. `page.js` makes `document.fullscreenElement`
read as truthy (without actually entering fullscreen) and dispatches a `resize`,
which colonist already listens for (`addEventListener("resize", resizeScreen)`),
so the board recomputes at full width/height.

### Known trade-off

The in-game fullscreen toggle button (the little expand icon) thinks it's already
fullscreen, so it won't enter the browser's Fullscreen API. The board is already
full-window, so this is cosmetic. Browser fullscreen via **F11** still works.

## Troubleshooting

- **No change:** reload the colonist tab after installing. Confirm the extension
  is enabled and the URL is under `colonist.io`.
- **Gutters flash then expand:** expected on first paint; the resize lands within
  a few hundred ms.
- **Board didn't resize at all:** open DevTools console on colonist.io and check
  that `page.js` loaded (no CSP/error). The fix depends on colonist gating ad
  gutters on `document.fullscreenElement`; if a future colonist update changes
  that, this will need updating.
