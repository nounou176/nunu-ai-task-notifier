# Contributing to NUNU AI Task Notifier

Thanks for helping improve NUNU AI Task Notifier.

## Good first contributions

- bug reports;
- Chrome/Linux/Windows/macOS compatibility reports;
- translation improvements;
- accessibility improvements;
- UI polish;
- documentation and screenshots;
- fixes for task detection, notifications, audio, or voice handling.

## Development setup

1. Clone the repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the repository folder containing `manifest.json`.
6. After code changes, reload the extension from `chrome://extensions`.

## Before opening a pull request

Please verify:

- `node --check background.js`
- `node --check content.js`
- `node --check offscreen.js`
- `node --check popup.js`
- `manifest.json` is valid JSON
- Sound mode still works
- Voice mode still works
- Active ChatGPT tab does not alert unnecessarily
- Background completion creates the expected unread state
- Opening a completed task clears its unread state

## Keep the extension focused

NUNU has one core purpose: notify users when ChatGPT tasks finish.

New features should support that purpose directly and should avoid unnecessary permissions, remote services, tracking, or unrelated functionality.

## Audio assets

Do not add audio files unless their redistribution license is explicit and compatible with this repository.

## Privacy

Do not add analytics, telemetry, remote APIs, or data collection without a clear design discussion and corresponding update to `PRIVACY.md`.

## Pull requests

Keep PRs small when possible. Explain:

- what problem is being solved;
- what changed;
- how it was tested;
- any permission or privacy impact.
