# 🔔 NUNU AI Task Notifier

**ChatGPT 終わった？NUNU がピン！🔔**

タスクを送る。別タブへ行く。終わったら NUNU が知らせます。

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 独立したオープンソース拡張機能です。OpenAI 公式ではありません。

<table align="center">
<tr>
<td align="center">
<img src="docs/images/readme/overview.png" width="800" alt="NUNU AI Task Notifier — ChatGPT のタスク完了をタブでお知らせ">
</td>
</tr>
</table>

<table align="center">
<tr>
<td align="center">
<a href="https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl">
<img src="https://img.shields.io/badge/Chrome%20Web%20Store-%E4%BB%8A%E3%81%99%E3%81%90%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome ウェブストアから NUNU AI Task Notifier をインストール">
</a>
</td>
</tr>
</table>

## 使い方

1. Prompt を送る。
2. 別のことをする。
3. `⏳` 実行中。
4. `✅` 完了。
5. クリック → タスクへ戻る。

```text
Prompt → ⏳ → 別作業 → ✅ → クリック
```

<table align="center">
<tr>
<td align="center" width="33%">
<img src="docs/images/readme/1.png" width="260" alt="ChatGPT の実行中はタブに砂時計アイコンを表示"><br>
<sub><b>1. `⏳` 実行中</b><br>タブのアイコンが変わったら、別の作業へ</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/2.png" width="260" alt="タスクが完了するとタブに緑のチェックマークを表示"><br>
<sub><b>2. `✅` 完了</b><br>アイコンの変化でタスクの完了をお知らせ</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/3.png" width="260" alt="デスクトップ通知をクリックしてタスクのタブに戻る"><br>
<sub><b>3. 🔔 クリック → 戻る</b><br>通知をクリックすると該当のタブへ移動</sub>
</td>
</tr>
</table>

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

### Chrome ウェブストア（おすすめ）

[NUNU AI Task Notifier をインストール →](https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl)

インストール後、NUNU をツールバーに固定するとすぐに開けます。

<table width="640">
<tr>
<th align="center" width="50%">1. 拡張機能を固定</th>
<th align="center" width="50%">2. ツールバーから NUNU を開く</th>
</tr>
<tr>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pin.png" width="300" alt="パズルのアイコンをクリックし、ピンで NUNU をツールバーに固定">
</td>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pinned.png" width="200" alt="Chrome のツールバーに固定された NUNU アイコン">
</td>
</tr>
<tr>
<td align="center" valign="top">
<sub><b>パズルのアイコン</b> → NUNU 横の<b>ピン</b>。</sub>
</td>
<td align="center" valign="top">
<sub><b>NUNU</b> アイコンで設定を開きます。</sub>
</td>
</tr>
</table>

ポップアップの設定画面：

<table>
<tr>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-sound.png" width="260" alt="NUNU の Sound 設定：通知音・音量・繰り返し">
</td>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-voice.png" width="260" alt="NUNU の Voice 設定：読み上げ言語・音量">
</td>
</tr>
<tr>
<td align="left" valign="top">
<sub><b>Sound</b> — 通知音・音量・繰り返しを設定</sub>
</td>
<td align="left" valign="top">
<sub><b>Voice</b> — 読み上げ言語・音量を設定</sub>
</td>
</tr>
</table>

<details>
<summary><b>ソースからインストール（開発者向け）</b></summary>

1. Repo を clone/download。
2. `chrome://extensions` を開く。
3. **Developer mode** ON。
4. **Load unpacked**。
5. `manifest.json` のある folder を選ぶ。
6. NUNU を pin。
7. `https://chatgpt.com` を開く。

完了。🎉

</details>

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

## Contributing

Bug、翻訳、PR 歓迎です。

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio は別 license の場合があります。  
[LICENSE](LICENSE) / [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
