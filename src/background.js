const DEFAULTS = { enabled: true, strip: true, skip: true, cosmetic: true };
const STATS = { adsSkipped: 0, adsStripped: 0 };

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(null);
  await chrome.storage.local.set({ ...DEFAULTS, ...STATS, ...current });
  await syncRuleset(current.enabled ?? true);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "count" || !(message.key in STATS)) return;
  chrome.storage.local.get(STATS).then((stats) =>
    chrome.storage.local.set({ [message.key]: stats[message.key] + (message.n || 1) })
  );
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "enabled" in changes) syncRuleset(changes.enabled.newValue);
});

function syncRuleset(enabled) {
  return chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled ? { enableRulesetIds: ["ads"] } : { disableRulesetIds: ["ads"] }
  );
}
