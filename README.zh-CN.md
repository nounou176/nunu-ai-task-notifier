# 🔔 NUNU AI Task Notifier

**ChatGPT 好了？NUNU 提醒你。🔔**

发任务，切走。完成后，NUNU 叫你回来。

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 独立开源扩展。不是 OpenAI 官方产品。

## 怎么用？

1. 发送 Prompt。
2. 去忙别的。
3. `⏳` 运行中。
4. `✅` 完成。
5. 点击 → 回到 task。

```text
Prompt → ⏳ → 忙别的 → ✅ → 点击
```

## 为什么？

因为每 10 秒看一次 ChatGPT 很累。

NUNU 帮你盯着。

## Features

- `⏳` 运行中
- `✅` 完成 / 未读
- 🔔 Desktop 通知
- 🔊 Sound 通知
- 🗣️ Voice 通知
- 📥 Multi-tab Task Inbox
- 🔢 未读 Badge
- 🧹 合并接近的提醒
- 🌏 Auto language: EN / VI / JA / KO / ZH
- 💾 Reload 后仍保留 task state

## Install

### Chrome Web Store

Coming soon.

### 从 Source 安装

1. Clone/download repo。
2. 打开 `chrome://extensions`。
3. 开启 **Developer mode**。
4. 点击 **Load unpacked**。
5. 选择包含 `manifest.json` 的 folder。
6. Pin NUNU。
7. 打开 `https://chatgpt.com`。

搞定。🎉

## Sound

NUNU → **Sound**

选提示音、Preview、调 volume、loop 或上传 custom audio。

## Voice

NUNU → **Voice**

选择语言或 **Auto**。  
Voice 取决于 browser/OS。

## 已经在那个 tab？

NUNU 不打扰。

Background task？Ping. 🔔

## 多个 task？

当然。

每个 ChatGPT tab 单独跟踪。  
一起完成 → 提醒一起发。

## Privacy

Local-first:

- 不需要 NUNU account
- 没有 NUNU backend
- 无广告
- 默认无 analytics
- 不出售 user data
- settings 保存在 Chrome local storage
- access 仅限 `https://chatgpt.com/*`

Voice 使用 browser/OS speech synthesis。部分 voice 可能依赖网络。

详情：[PRIVACY.md](PRIVACY.md)

## Permissions

只要需要的权限：

- `notifications` — 完成提醒
- `storage` — settings + task state
- `webRequest` — 检测 request 完成
- `offscreen` — background sound/voice
- `scripting` — 恢复 integration
- `https://chatgpt.com/*` — ChatGPT only

NUNU 不会 block 或 modify ChatGPT request。

## Status

目前可作为 unpacked Chrome extension 使用。

下一步：Chrome Web Store。

## Contributing

Bug、翻译、PR 都欢迎。

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio 可能使用单独 license。  
[LICENSE](LICENSE) / [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
