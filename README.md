# 🔔 NUNU AI Task Notifier

**ChatGPT done? We’ll ping you. 🔔**

Send a task. Leave the tab. NUNU tells you when it’s ready.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> Independent open-source extension. Not affiliated with OpenAI.

<table align="center">
<tr>
<td align="center">
<img src="docs/images/readme/overview.png" width="800" alt="NUNU AI Task Notifier — tab indicator when a ChatGPT task finishes">
</td>
</tr>
</table>

<table align="center">
<tr>
<td align="center">
<a href="https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl">
<img src="https://img.shields.io/badge/Chrome%20Web%20Store-Install%20now-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Install NUNU AI Task Notifier from the Chrome Web Store">
</a>
</td>
</tr>
</table>

## How it works

1. Send a prompt.
2. Go do something else.
3. `⏳` Working.
4. `✅` Done.
5. Click → back to the task.

```text
Prompt → ⏳ → chill/work → ✅ → click
```

<table align="center">
<tr>
<td align="center" width="33%">
<img src="docs/images/readme/1.png" width="260" alt="Tab shows an hourglass while ChatGPT is working"><br>
<sub><b>1. `⏳` Working</b><br>The tab icon changes — go do something else</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/2.png" width="260" alt="Tab shows a green check mark when the task finishes"><br>
<sub><b>2. `✅` Done</b><br>The icon changes to show the task is complete</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/3.png" width="260" alt="Desktop notification: click to return to the task tab"><br>
<sub><b>3. 🔔 Click → return</b><br>Click the notification to open the right tab</sub>
</td>
</tr>
</table>

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

### Chrome Web Store (recommended)

[Install NUNU AI Task Notifier →](https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl)

Pin NUNU to the toolbar for quick access after installation:

<table width="640">
<tr>
<th align="center" width="50%">1. Pin the extension</th>
<th align="center" width="50%">2. Open NUNU from the toolbar</th>
</tr>
<tr>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pin.png" width="300" alt="Click the puzzle piece icon, then Pin to keep NUNU on the toolbar">
</td>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pinned.png" width="200" alt="NUNU icon pinned to the Chrome toolbar">
</td>
</tr>
<tr>
<td align="center" valign="top">
<sub>Click <b>puzzle piece</b> → <b>Pin</b> next to NUNU.</sub>
</td>
<td align="center" valign="top">
<sub>Click the <b>NUNU</b> icon to open settings.</sub>
</td>
</tr>
</table>

Settings in the popup:

<table>
<tr>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-sound.png" width="260" alt="NUNU Sound popup: choose a sound, volume and looping">
</td>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-voice.png" width="260" alt="NUNU Voice popup: choose a spoken language and volume">
</td>
</tr>
<tr>
<td align="left" valign="top">
<sub><b>Sound</b> — choose a sound, volume and looping</sub>
</td>
<td align="left" valign="top">
<sub><b>Voice</b> — choose a language and volume</sub>
</td>
</tr>
</table>

<details>
<summary><b>Install from source (for developers)</b></summary>

1. Clone/download this repo.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Pick the folder with `manifest.json`.
6. Pin NUNU.
7. Open `https://chatgpt.com`.

Done. 🎉

</details>

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

## Contributing

Bugs, translations and PRs are welcome.

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio may use separate licenses.  
See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
