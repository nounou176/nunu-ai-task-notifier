# 🔔 NUNU AI Task Notifier

**ChatGPT 終わった？NUNU がピン！🔔**

タスクを送る。別タブへ行く。終わったら NUNU が知らせます。

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 独立したオープンソース拡張機能です。OpenAI 公式ではありません。

## 使い方

1. Prompt を送る。
2. 別のことをする。
3. `⏳` 実行中。
4. `✅` 完了。
5. クリック → タスクへ戻る。

```text
Prompt → ⏳ → 別作業 → ✅ → クリック
```

## なぜ？

ChatGPT タブを10秒ごとに見るのは疲れるから。

NUNU が見ます。あなたは見なくてOK。

## Features

- `⏳` 実行中
- `✅` 完了 / 未読
- 🔔 Desktop 通知
- 🔊 Sound 通知
- 🗣️ Voice 通知
- 📥 Multi-tab Task Inbox
- 🔢 未読 Badge
- 🧹 近い通知をまとめる
- 🌏 Auto language: EN / VI / JA / KO / ZH
- 💾 Reload 後も task state を保持

## Install

### Chrome Web Store

Coming soon.

### Source から

1. Repo を clone/download。
2. `chrome://extensions` を開く。
3. **Developer mode** ON。
4. **Load unpacked**。
5. `manifest.json` のある folder を選ぶ。
6. NUNU を pin。
7. `https://chatgpt.com` を開く。

完了。🎉

## Sound

NUNU → **Sound**

Sound 選択、Preview、volume、loop、custom audio。

## Voice

NUNU → **Voice**

言語または **Auto** を選択。  
Voice は browser/OS によります。

## もうそのタブにいる？

NUNU は静かにします。

Background task？ピン！🔔

## 複数タスク？

もちろん。

各 ChatGPT tab を別々に追跡。  
同時に終わった通知はまとめます。

## Privacy

Local-first:

- NUNU account 不要
- NUNU backend なし
- 広告なし
- default analytics なし
- user data を販売しない
- settings は Chrome local storage
- access は `https://chatgpt.com/*` のみ

Voice は browser/OS speech synthesis を使います。一部 voice は network-backed の場合があります。

詳細: [PRIVACY.md](PRIVACY.md)

## Permissions

必要なものだけ:

- `notifications` — 完了通知
- `storage` — settings + task state
- `webRequest` — request 完了検知
- `offscreen` — background sound/voice
- `scripting` — integration 復元
- `https://chatgpt.com/*` — ChatGPT only

NUNU は ChatGPT request を block / modify しません。

## Status

現在 unpacked Chrome extension として利用できます。

次は Chrome Web Store。

## Contributing

Bug、翻訳、PR 歓迎です。

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio は別 license の場合があります。  
[LICENSE](LICENSE) / [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
