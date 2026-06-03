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
> package and sign it with [`web-ext`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
> (`web-ext sign`) or self-distribute via addons.mozilla.org.

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
