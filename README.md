# yt-adblocker

A Chrome extension that blocks YouTube ads. It's open source and doesn't collect anything.

## What it does

It blocks requests to Google's ad servers and removes the ad data from YouTube's player before the video loads. If an ad still sneaks through, it mutes it and jumps to the end. Banner and feed ads are hidden with CSS.

You can turn each of these on or off from the toolbar popup.

## Install

It isn't in the Chrome Web Store yet, so you load it yourself:

1. Download the zip from [Releases](https://github.com/Jaedyns/yt-adblocker/releases) and unzip it (or clone the repo).
2. Open `chrome://extensions` and turn on Developer mode.
3. Click Load unpacked and pick the folder.

Edge, Brave, and other Chromium browsers work the same way.

## If an ad gets through

YouTube changes its site a lot, so this will break now and then. [Open an issue](https://github.com/Jaedyns/yt-adblocker/issues/new/choose) with the video link and what you saw.

If YouTube shows an "ad blockers aren't allowed" warning, turn off "Remove ads before they load" in the popup. Auto-skip still works without it.

## Contributing

PRs are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) covers setup. Issues labeled `good first issue` are a good place to start.

| File | What it does |
| --- | --- |
| `rules.json` | Network rules that block ad requests |
| `src/inject.js` | Strips ad data out of YouTube's player responses |
| `src/content.js` | Skips ads that play anyway, applies settings |
| `src/cosmetic.css` | Hides ad elements on the page |
| `src/popup.*` | The toolbar popup |

## License

MIT
