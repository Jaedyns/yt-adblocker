const DEFAULTS = { enabled: true, strip: true, skip: true, cosmetic: true };

const SKIP_BUTTONS = [
  ".ytp-skip-ad-button",
  ".ytp-ad-skip-button",
  ".ytp-ad-skip-button-modern",
  ".ytp-ad-skip-button-slot button",
].join(",");

let settings = { ...DEFAULTS };
let adActive = false;
let saved = null;

function applySettings(next) {
  settings = { ...DEFAULTS, ...next };
  const on = (flag) => (settings.enabled && settings[flag] ? "on" : "off");
  const root = document.documentElement;
  root.dataset.ytabStrip = on("strip");
  root.dataset.ytabCosmetic = on("cosmetic");
}

function count(key, n = 1) {
  chrome.runtime.sendMessage({ type: "count", key, n }).catch(() => {});
}

function endAd(video) {
  adActive = false;
  if (video && saved) {
    video.muted = saved.muted;
    video.playbackRate = saved.rate;
  }
  saved = null;
  count("adsSkipped");
}

function tick() {
  if (!settings.enabled || !settings.skip) return;

  document.querySelector(".ytp-ad-overlay-close-button")?.click();

  const player = document.querySelector("#movie_player, .html5-video-player");
  const video = player?.querySelector("video");
  const showingAd = player?.classList.contains("ad-showing");

  if (!showingAd) {
    if (adActive) endAd(video);
    return;
  }

  if (!adActive) {
    adActive = true;
    saved = video ? { muted: video.muted, rate: video.playbackRate } : null;
  }

  player.querySelector(SKIP_BUTTONS)?.click();

  if (video && Number.isFinite(video.duration) && video.duration > 0) {
    video.muted = true;
    video.playbackRate = 16;
    video.currentTime = Math.max(video.duration - 0.1, 0);
  }
}

applySettings(DEFAULTS);
chrome.storage.local.get(DEFAULTS).then(applySettings);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  const next = { ...settings };
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key in DEFAULTS) next[key] = newValue;
  }
  applySettings(next);
});

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.source !== "ytab") return;
  if (event.data.type === "stripped") count("adsStripped");
});

setInterval(tick, 250);
