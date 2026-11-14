// Runs in the page's own JS world so it can rewrite YouTube's player data before the player reads it.
(() => {
  const AD_KEYS = ["adPlacements", "adSlots", "playerAds", "adBreakHeartbeatParams"];

  const enabled = () => document.documentElement?.dataset.ytabStrip !== "off";

  function strip(data) {
    if (!data || typeof data !== "object" || !enabled()) return data;
    let removed = 0;
    // Some page loads send an array of parts, one of which holds playerResponse.
    const parts = Array.isArray(data) ? data : [data];
    const targets = parts.flatMap((part) => [part, part?.playerResponse]);
    for (const target of targets) {
      if (!target || typeof target !== "object") continue;
      for (const key of AD_KEYS) {
        if (key in target) {
          delete target[key];
          removed++;
        }
      }
    }
    if (removed) window.postMessage({ source: "ytab", type: "stripped", count: removed }, "*");
    return data;
  }

  const originalParse = JSON.parse;
  JSON.parse = function (...args) {
    return strip(originalParse.apply(this, args));
  };

  if (typeof Response !== "undefined") {
    const originalJson = Response.prototype.json;
    Response.prototype.json = async function () {
      return strip(await originalJson.call(this));
    };
  }

  let initialPlayerResponse;
  Object.defineProperty(window, "ytInitialPlayerResponse", {
    configurable: true,
    get: () => initialPlayerResponse,
    set: (value) => {
      initialPlayerResponse = strip(value);
    },
  });
})();
