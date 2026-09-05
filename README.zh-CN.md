# 🔔 NUNU AI Task Notifier

**不用再反复切回 ChatGPT 标签页查看任务是否完成。**

NUNU 会跟踪你的 ChatGPT 任务，并在任务完成时通过标签页状态、桌面通知、声音或语音，以及一个用于管理多个 ChatGPT 标签页的小型 Task Inbox 提醒你。

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 这是一个独立的开源浏览器扩展，与 OpenAI 无官方隶属或背书关系。

## 10 秒看懂怎么用

1. 在 ChatGPT 发送一个 prompt。
2. 切到其他标签页继续工作。
3. ChatGPT 任务运行时，NUNU 会在标签页标题前显示 `⏳`。
4. 完成后变成 `✅`，并触发你设置的提醒。
5. 点击桌面通知，或在 Task Inbox 里点击 **Open**，即可回到对应的 ChatGPT 标签页。

```text
发送 prompt → ⏳ 运行中 → 去做别的事 → ✅ 完成 → 点击 → 回到对应任务
```

## 为什么需要它？

当 ChatGPT 回复较慢，或你同时运行多个标签页时，频繁切回检查会打断专注。NUNU 把这些后台任务变成一个简单的队列：你继续做自己的事，任务完成时再提醒你。

## 功能

- `⏳` — ChatGPT 任务仍在运行。
- `✅` — 后台任务已完成但尚未阅读。
- 桌面通知可返回对应任务。
- 扩展图标 badge 显示未读完成任务数量。
- Popup 显示 **RUNNING** 和 **DONE / UNREAD**。
- 多个任务在接近时间完成时会合并提醒，避免声音重叠。
- **Sound mode** — 选择提示音、Preview、音量、循环、上传自定义音频。
- **Voice mode** — 使用浏览器/系统的 speech synthesis 朗读完成提醒。
- Auto language 支持 English、Tiếng Việt、日本語、한국어、中文。
- Reload 扩展后仍可保留任务状态。

## Demo

公开演示素材放在 `docs/`：

- `docs/images/01-hero.png`
- `docs/images/02-sound-mode.png`
- `docs/images/03-voice-mode.png`
- `docs/images/04-task-inbox.png`
- `docs/images/05-notification.png`
- `docs/demo/demo.gif`

截图指南：[docs/SCREENSHOTS.md](docs/SCREENSHOTS.md)

## 安装

### Chrome Web Store

完成公开发布检查和打包后提供。

### 从源码手动安装

1. 下载或 clone 本仓库。
2. 打开 `chrome://extensions`。
3. 开启 **Developer mode**。
4. 点击 **Load unpacked**。
5. 选择包含 `manifest.json` 的扩展目录。
6. 将 **NUNU AI Task Notifier** 固定到工具栏。
7. 打开 `https://chatgpt.com` 并正常使用 ChatGPT。

## 使用方法

### Sound mode

打开 Popup → 选择 **Sound**。

你可以：
- 选择内置提示音；
- Preview 一次；
- 上传小型 custom audio；
- 调整音量；
- 循环播放直到打开任务；
- 使用 **Test alert** 预先测试。

### Voice mode

选择 **Voice**，然后选择语言或 **Auto**。

如果 browser/OS 提供合适的 voice，NUNU 会朗读任务完成提醒。可用 voice 取决于浏览器和操作系统。

## 当前标签页时保持安静

如果任务完成时你正好正在查看那个 ChatGPT 标签页，NUNU 会有意保持安静，不发送额外提醒。

只有在后台完成的任务才会变成 unread 并触发你设置的 alert。

## 多任务

你可以同时运行多个 ChatGPT 标签页，每个标签页都会单独跟踪。

如果多个任务几乎同时完成，NUNU 会聚合提醒，避免多个声音/语音重叠。

## Privacy

NUNU 采用 local-first 设计：

- 不需要 NUNU 账号；
- 不使用 NUNU 后端服务器；
- 无广告；
- 默认无 analytics；
- 不出售用户数据；
- settings 和 task state 保存在 Chrome local storage；
- 站点访问限制为 `https://chatgpt.com/*`。

Voice playback 使用 browser/OS 提供的 speech synthesis。某些 voice 可能是 network-backed。

完整说明：[PRIVACY.md](PRIVACY.md)

## Permissions

- `notifications` — 任务完成通知。
- `storage` — 保存设置、unread state 和可选 custom audio。
- `webRequest` — 观察 ChatGPT request 何时完成，不拦截也不修改请求。
- `offscreen` — Popup 关闭后仍能播放 audio/speech。
- `scripting` — 必要时恢复 ChatGPT content integration。
- `https://chatgpt.com/*` — 仅允许访问 ChatGPT。

## 当前状态

现在已经可以作为 unpacked Chrome extension 使用。提交 Chrome Web Store 前仍会处理 TTS fallback warning、audio license 和 store assets。

## Contributing

欢迎 bug report、兼容性报告、翻译和 pull request。参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

源码采用 MIT License。Audio asset 可能有单独许可证；如果再分发权限不明确，则不会包含在 public release 中。
