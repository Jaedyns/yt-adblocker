# Contributing

Thanks for helping out. Most fixes are small, so don't overthink it.

## Setup

1. Fork and clone the repo.
2. Load the folder as an unpacked extension at `chrome://extensions`.
3. After you change something, hit the reload icon on the extension card and refresh YouTube.

Before you open a PR, run:

```bash
npm test
```

That checks the manifest and rules and runs the tests. You need Node 20 or newer. There's nothing to install.

## Common fixes

An ad element is showing on the page: find its tag or class in DevTools and add it to `src/cosmetic.css`.

An ad request isn't blocked: add a rule to `rules.json`. Give it the next unused `id`.

The skip button changed: update `SKIP_BUTTONS` in `src/content.js`.

YouTube renamed the ad fields in its player data: update `AD_KEYS` in `src/inject.js`.

## Pull requests

Keep each PR to one fix if you can. Say what you changed and how you tested it (which page, which kind of ad). Screenshots help.

## Releases

Bump `version` in `manifest.json`, then push a tag like `v0.2.0`. GitHub Actions builds the zip and publishes the release.
