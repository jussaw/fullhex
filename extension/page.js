/*
 * FullHex — page-context script (runs in colonist's own JS world)
 *
 * How colonist sizes the in-game board (from its minified bundle):
 *
 *   getInGameVerticalAdWidth()    -> 165   // reserved gutter on EACH side
 *   getInGameHorizontalAdHeight() -> 90    // reserved gutter on the bottom
 *
 *   showVerticalAds()   = !forceHideAds && !hideAds() && !discord && !mobile
 *                         && !document.fullscreenElement
 *                         && (innerWidth > 1500 || landscape)
 *   showHorizontalAds() = !hideAds() && !discord
 *                         && !document.fullscreenElement
 *                         && innerHeight >= 1000 && !forceHideAds
 *
 *   getAppWnH()  uses innerWidth - 2*165 (and innerHeight - 90) when those are true
 *   getCanvasX() offsets the canvas by 165 when showVerticalAds() is true
 *   window.addEventListener("resize", resizeScreen)  // recompute hook
 *
 * Both show*Ads() short-circuit to false when document.fullscreenElement is
 * truthy — that's colonist's own "no gutters, fill the window" path. We make
 * fullscreenElement read as truthy (without actually entering fullscreen) and
 * then dispatch a resize so colonist recomputes the board at full size.
 *
 * Only side effect: the in-game fullscreen toggle button thinks it's already
 * fullscreen (the board is full-window anyway). Everything else is untouched.
 */
(function () {
  "use strict";

  function makeTruthyFullscreen(prop) {
    try {
      var desc =
        Object.getOwnPropertyDescriptor(document, prop) ||
        Object.getOwnPropertyDescriptor(Document.prototype, prop);
      var realGet = desc && desc.get;
      Object.defineProperty(document, prop, {
        configurable: true,
        get: function () {
          // Preserve the real element if genuinely fullscreen; otherwise return
          // a truthy sentinel so colonist keeps the ad gutters collapsed.
          var real = realGet ? realGet.call(document) : null;
          return real || document.documentElement;
        }
      });
    } catch (e) {
      /* property not redefinable in this browser; nothing else to do */
    }
  }

  makeTruthyFullscreen("fullscreenElement");
  makeTruthyFullscreen("webkitFullscreenElement");

  function nudge() {
    window.dispatchEvent(new Event("resize"));
  }

  // Force colonist to recompute the layout once our override is active.
  // Covers: page already loaded, normal load, and a game scene mounting a bit
  // later via colonist's hash-based SPA navigation.
  nudge();
  window.addEventListener("load", nudge);
  [250, 750, 1500, 3000].forEach(function (ms) { setTimeout(nudge, ms); });
  window.addEventListener("hashchange", function () { setTimeout(nudge, 300); });
})();
