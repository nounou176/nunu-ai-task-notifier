# 🔔 NUNU AI Task Notifier

**ChatGPT のタブを何度も確認する必要をなくします。**

NUNU は ChatGPT のタスクを監視し、完了したらタブ状態、デスクトップ通知、サウンドまたは音声、そして複数タブ用の小さな Task Inbox で知らせます。

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 独立したオープンソース拡張機能です。OpenAI 公式・公認の製品ではありません。

## 10秒で使い方がわかる

1. ChatGPT でプロンプトを送信します。
2. 別のタブへ移動して作業を続けます。
3. 実行中は ChatGPT タブに `⏳` が表示されます。
4. 完了すると `✅` に変わり、設定した通知が届きます。
5. 通知または Task Inbox の **Open** を押すと、その ChatGPT タブへ戻れます。

```text
送信 → ⏳ 実行中 → 別作業 → ✅ 完了 → クリック → 元のタスク
```

## なぜ使うの？

ChatGPT の返答に時間がかかると、何度もタブを確認して集中が途切れがちです。複数タブを同時に使う場合はさらに面倒になります。NUNU は完了するまでタスクをバックグラウンドのキューとして扱い、終わったときだけ知らせます。

## 主な機能

- `⏳` — ChatGPT タスクが実行中。
- `✅` — バックグラウンドのタスクが完了し、まだ未読。
- デスクトップ通知から該当タスクへ戻れます。
- 拡張機能のバッジに未読完了数を表示します。
- Popup に **RUNNING** と **DONE / UNREAD** を表示します。
- 複数タスクがほぼ同時に完了した場合、通知をまとめます。
- **Sound mode** — サウンド選択、Preview、音量、ループ、カスタム音声アップロード。
- **Voice mode** — ブラウザ/OS の音声合成を利用した完了読み上げ。
- Auto language は English / Tiếng Việt / 日本語 / 한국어 / 中文 に対応。
- 拡張機能を Reload してもタスク状態を保持します。

## Demo

公開用デモ素材は `docs/` に置きます。

- `docs/images/01-hero.png` — 複数 ChatGPT タブ + 通知
- `docs/images/02-sound-mode.png` — Sound mode
- `docs/images/03-voice-mode.png` — Voice mode
- `docs/images/04-task-inbox.png` — Running / Done / Unread
- `docs/images/05-notification.png` — デスクトップ通知
- `docs/demo/demo.gif` — 全体フロー

撮影手順: [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md)

## インストール

### Chrome Web Store

公開レビューとパッケージング完了後に追加予定です。

### ソースから手動インストール

1. このリポジトリをダウンロードまたは clone します。
2. `chrome://extensions` を開きます。
3. **Developer mode** を有効にします。
4. **Load unpacked** を押します。
5. `manifest.json` を含む extension フォルダを選びます。
6. **NUNU AI Task Notifier** をツールバーに固定します。
7. `https://chatgpt.com` を開き、通常どおり使います。

## 使い方

### Sound mode

Popup を開き **Sound** を選択します。

- 内蔵サウンドを選択
- Preview を1回再生
- 小さいカスタム音声ファイルをアップロード
- 音量調整
- タスクを開くまでループ
- **Test alert** で事前確認

### Voice mode

**Voice** を選び、言語または **Auto** を選びます。

適切な browser/OS voice が利用できる場合、NUNU が完了通知を読み上げます。利用可能な voice はブラウザと OS に依存します。

## アクティブタブでは静かに

回答完了時にその ChatGPT タブを見ている場合、NUNU は意図的に通知しません。

バックグラウンドで完了した場合のみ unread になり、設定した alert が実行されます。

## 複数タスク

複数の ChatGPT タブを同時に実行できます。各タブは個別に追跡されます。

複数タスクが近いタイミングで終わった場合、重複した音声を避けるため alert をまとめます。

## Privacy

NUNU は local-first を前提に設計されています。

- NUNU アカウント不要
- NUNU サーバーなし
- 広告なし
- デフォルトで analytics なし
- ユーザーデータを販売しない
- 設定とタスク状態は Chrome local storage に保存
- サイトアクセスは `https://chatgpt.com/*` に限定

Voice playback は browser / OS の speech synthesis を利用します。一部の voice は network-backed の場合があります。

詳細: [PRIVACY.md](PRIVACY.md)

## Permissions

- `notifications` — 完了通知。
- `storage` — 設定、未読状態、任意の custom audio。
- `webRequest` — ChatGPT request の完了を監視。block / modify はしません。
- `offscreen` — Popup を閉じた状態で audio / speech を再生。
- `scripting` — 必要時に ChatGPT content integration を復元。
- `https://chatgpt.com/*` — ChatGPT のみにアクセス範囲を制限。

## Status

現在 unpacked extension として利用できます。Chrome Web Store 提出前に、TTS fallback warning、audio license、store assets などを最終調整します。

## Contributing

Bug report、互換性報告、翻訳、pull request を歓迎します。[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## License

ソースコードは MIT License。Audio asset は別ライセンスの場合があり、再配布可能なライセンスが明記されるまでは public release に含めない方針です。
