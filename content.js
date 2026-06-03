/*
 * FullHex — content script (isolated world)
 *
 * Colonist sizes the game board in JavaScript, not from the ad DOM, so hiding
 * the ad elements alone does nothing. The actual sizing lives in page-context
 * code we can't reach from the isolated content-script world. So we inject
 * page.js into the page's own JS context to flip colonist's "fill the window"
 * code path. See page.js for the details.
 */
(function () {
  "use strict";
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL("page.js");
  s.async = false; // preserve execution order
  s.onload = function () { s.remove(); };
  (document.head || document.documentElement).appendChild(s);
})();
