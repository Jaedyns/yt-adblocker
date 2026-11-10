const DEFAULTS = { enabled: true, strip: true, skip: true, cosmetic: true, adsSkipped: 0, adsStripped: 0 };
const toggles = document.querySelectorAll("input[data-key]");

function render(state) {
  for (const input of toggles) input.checked = state[input.dataset.key];
  document.body.classList.toggle("off", !state.enabled);
  document.getElementById("adsSkipped").textContent = state.adsSkipped.toLocaleString();
  document.getElementById("adsStripped").textContent = state.adsStripped.toLocaleString();
}

for (const input of toggles) {
  input.addEventListener("change", () => chrome.storage.local.set({ [input.dataset.key]: input.checked }));
}

chrome.storage.onChanged.addListener(() => chrome.storage.local.get(DEFAULTS).then(render));
chrome.storage.local.get(DEFAULTS).then(render);
document.getElementById("version").textContent = `v${chrome.runtime.getManifest().version}`;
