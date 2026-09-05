# 🔔 NUNU AI Task Notifier

**ChatGPT 끝났어? NUNU가 알려줄게. 🔔**

프롬프트 보내고 다른 탭으로 가세요. 끝나면 NUNU가 알려줍니다.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 독립 오픈소스 확장 프로그램입니다. OpenAI 공식 제품이 아닙니다.

## 사용법

1. Prompt 전송.
2. 다른 일 하기.
3. `⏳` 작업 중.
4. `✅` 완료.
5. 클릭 → task로 돌아가기.

```text
Prompt → ⏳ → 다른 일 → ✅ → 클릭
```

## 왜?

ChatGPT 탭을 10초마다 확인하면 피곤하니까요.

NUNU가 봅니다. 당신은 안 봐도 돼요.

## Features

- `⏳` 실행 중
- `✅` 완료 / unread
- 🔔 Desktop 알림
- 🔊 Sound 알림
- 🗣️ Voice 알림
- 📥 Multi-tab Task Inbox
- 🔢 Unread badge
- 🧹 가까운 알림 묶기
- 🌏 Auto language: EN / VI / JA / KO / ZH
- 💾 Reload 후에도 task state 유지

## Install

### Chrome Web Store

Coming soon.

### Source에서

1. Repo clone/download.
2. `chrome://extensions` 열기.
3. **Developer mode** 켜기.
4. **Load unpacked**.
5. `manifest.json` folder 선택.
6. NUNU pin.
7. `https://chatgpt.com` 열기.

끝. 🎉

## Sound

NUNU → **Sound**

사운드 선택, Preview, volume, loop, custom audio.

## Voice

NUNU → **Voice**

언어 또는 **Auto** 선택.  
Voice는 browser/OS에 따라 다릅니다.

## 이미 그 탭을 보고 있다면?

NUNU는 조용히.

Background task? Ping. 🔔

## 여러 task?

물론이죠.

각 ChatGPT tab을 따로 추적합니다.  
같이 끝나면 알림도 묶습니다.

## Privacy

Local-first:

- NUNU account 없음
- NUNU backend 없음
- 광고 없음
- 기본 analytics 없음
- user data 판매 없음
- settings는 Chrome local storage
- access는 `https://chatgpt.com/*`만

Voice는 browser/OS speech synthesis를 사용합니다. 일부 voice는 network-backed일 수 있습니다.

자세히: [PRIVACY.md](PRIVACY.md)

## Permissions

필요한 것만:

- `notifications` — 완료 알림
- `storage` — settings + task state
- `webRequest` — request 완료 감지
- `offscreen` — background sound/voice
- `scripting` — integration 복구
- `https://chatgpt.com/*` — ChatGPT only

NUNU는 ChatGPT request를 block / modify하지 않습니다.

## Status

현재 unpacked Chrome extension으로 사용할 수 있습니다.

다음은 Chrome Web Store.

## Contributing

Bug, 번역, PR 모두 환영합니다.

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio는 별도 license일 수 있습니다.  
[LICENSE](LICENSE) / [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
