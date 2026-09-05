# 🔔 NUNU AI Task Notifier

**ChatGPT done? We’ll ping you. 🔔**

Send a task. Leave the tab. NUNU tells you when it’s ready.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> Independent open-source extension. Not affiliated with OpenAI.

## How it works

1. Send a prompt.
2. Go do something else.
3. `⏳` Working.
4. `✅` Done.
5. Click → back to the task.

```text
Prompt → ⏳ → chill/work → ✅ → click
```

## Why?

Because checking ChatGPT every 10 seconds gets old fast.

NUNU watches the tab. You don’t.

## Features

- `⏳` Running
- `✅` Done / unread
- 🔔 Desktop alerts
- 🔊 Sound alerts
- 🗣️ Voice alerts
- 📥 Multi-tab Task Inbox
- 🔢 Unread badge
- 🧹 Groups nearby alerts
- 🌏 Auto language: EN / VI / JA / KO / ZH
- 💾 Keeps task state after reload

## Install

### Chrome Web Store

Coming soon.

### From source

1. Clone/download this repo.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Pick the folder with `manifest.json`.
6. Pin NUNU.
7. Open `https://chatgpt.com`.

Done. 🎉

## Sound

NUNU → **Sound**

Pick a sound, preview it, set volume, loop it, or upload your own.

## Voice

NUNU → **Voice**

Pick a language or **Auto**.  
Available voices depend on your browser/OS.

## Already on the tab?

NUNU stays quiet.

Background task? Ping. 🔔

## Multiple tasks?

Yep.

Each ChatGPT tab is tracked separately.  
If several finish together, NUNU bundles the alerts.

## Privacy

Local-first:

- no NUNU account
- no NUNU backend
- no ads
- no analytics by default
- no selling user data
- settings stay in Chrome local storage
- access limited to `https://chatgpt.com/*`

Voice uses browser/OS speech synthesis. Some voices may use the network.

Full policy: [PRIVACY.md](PRIVACY.md)

## Permissions

Only what NUNU needs:

- `notifications` — alerts
- `storage` — settings + task state
- `webRequest` — detects finished ChatGPT requests
- `offscreen` — background sound/voice
- `scripting` — restores integration when needed
- `https://chatgpt.com/*` — ChatGPT only

NUNU does not block or modify ChatGPT requests.

## Status

Works now as an unpacked Chrome extension.

Chrome Web Store release is next.

## Contributing

Bugs, translations and PRs are welcome.

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio may use separate licenses.  
See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
