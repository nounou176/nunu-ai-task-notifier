# 🔔 NUNU AI Task Notifier

**Stop checking ChatGPT tabs over and over.**

NUNU watches your ChatGPT tasks and tells you when they finish — with a tab status, desktop notification, sound or voice alert, and a small task inbox for multiple ChatGPT tabs.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> Independent open-source browser extension. Not affiliated with or endorsed by OpenAI.

## See it in 10 seconds

1. Send a prompt in ChatGPT.
2. Switch to another tab and keep working.
3. NUNU marks the ChatGPT tab with `⏳` while it is running.
4. When it finishes, NUNU marks it with `✅` and alerts you.
5. Click the notification or **Open** in the Task Inbox to return to the exact ChatGPT tab.

```text
Send prompt → ⏳ running → keep working elsewhere → ✅ finished → click → exact task
```

## Why use it?

ChatGPT can take long enough that repeatedly checking a tab becomes distracting — especially when several tasks are running at once. NUNU turns those background tasks into a simple queue you can forget about until they are done.

## What it does

- `⏳` shows that a ChatGPT task is still running.
- `✅` shows that a background task finished and is still unread.
- Desktop notifications can take you back to the exact task.
- The extension badge shows how many completed tasks are unread.
- The popup shows **RUNNING** and **DONE / UNREAD** tasks.
- Multiple tasks finishing close together are grouped into one alert.
- **Sound mode** includes selectable notification sounds, preview, volume, optional looping, and custom audio upload.
- **Voice mode** can speak completion alerts using browser/OS speech synthesis.
- Auto language detection supports English, Vietnamese, Japanese, Korean, and Chinese.
- Task state survives extension reloads.

## Demo

The public demo assets are stored under `docs/`:

- `docs/images/01-hero.png` — multiple ChatGPT tabs + notification
- `docs/images/02-sound-mode.png` — Sound mode
- `docs/images/03-voice-mode.png` — Voice mode
- `docs/images/04-task-inbox.png` — running and completed tasks
- `docs/images/05-notification.png` — desktop notification
- `docs/demo/demo.gif` — full workflow

When the sound assets are present in the repository, you can preview them directly:

- 🔔 [Default Ding](sounds/default-ding.mp3)
- 💬 [Okay](sounds/okay.mp3)
- ⚡ [Suspense](sounds/suspense.mp3)
- 😮 [OMG Wow](sounds/omg-wow.mp3)
- ✅ [Correct](sounds/correct.mp3)

These audio files are third-party assets and are **not covered by the MIT License for the source code**. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for source attribution, provenance, and the copyright/takedown process.

See [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) for the exact capture checklist.

## Quick start

### Install from the Chrome Web Store

Chrome Web Store release: **coming after the public release is reviewed and packaged.**

### Install manually from source

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the extension folder containing `manifest.json`.
6. Pin **NUNU AI Task Notifier** to the toolbar.
7. Open `https://chatgpt.com` and use ChatGPT normally.

## How to use

### Sound mode

Open the NUNU popup and choose **Sound**.

You can:

- choose a built-in notification sound;
- preview it once;
- upload a small custom audio file;
- adjust volume;
- repeat the sound until the task is opened;
- use **Test alert** before starting work.

### Voice mode

Choose **Voice**, then select a language or **Auto**.

When a suitable browser/OS voice is available, NUNU speaks the completion alert. Voice availability depends on the browser and operating system. A lightweight language-safe fallback is planned for environments where a matching voice is unavailable.

## Background vs active tab

NUNU is intentionally quiet when you are already looking at the exact ChatGPT tab as the response finishes.

If the task finishes in the background, it becomes unread and can trigger the configured alert.

## Multiple ChatGPT tasks

You can run several ChatGPT tabs at the same time. Each tab is tracked separately.

If several tasks complete close together, NUNU aggregates the alert instead of playing overlapping sounds or voices.

## Privacy

NUNU is designed as a local-first extension:

- no NUNU account;
- no NUNU backend server;
- no ads;
- no analytics by default;
- no selling of user data;
- extension settings and task state are stored in Chrome local storage;
- access is restricted to `https://chatgpt.com/*`.

Voice playback uses speech synthesis provided by the browser or operating system. Some installed voices may be network-backed.

Read the full policy: [PRIVACY.md](PRIVACY.md).

## Permissions

NUNU uses a small set of Chrome extension permissions for its single purpose: **detecting when ChatGPT tasks finish and notifying the user.**

- `notifications` — desktop completion notifications.
- `storage` — settings, unread state, and optional custom audio.
- `webRequest` — observes completion of ChatGPT conversation requests; it does not block or modify them.
- `offscreen` — background audio and speech playback.
- `scripting` — restores the ChatGPT content integration when needed.
- `https://chatgpt.com/*` — limits site access to ChatGPT.

## Current status

The extension is usable today as an unpacked Chrome extension. Before the first Chrome Web Store submission we are finishing release hardening, store assets, third-party audio rights review, and a known speech-fallback warning shown by Chrome's extension error UI.

## Development

Main extension files:

```text
manifest.json
background.js
content.js
offscreen.html
offscreen.js
popup.html
popup.css
popup.js
sounds/
```

The extension uses Manifest V3 and does not require an external application server.

## Contributing

Bug reports, compatibility reports, translations, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The project's source code and original project documentation are released under the MIT License. Third-party audio assets are excluded from that grant unless a separate license is explicitly documented for a specific asset.

See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
