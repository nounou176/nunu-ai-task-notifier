# 🔔 NUNU AI Task Notifier

**ChatGPT 탭을 계속 확인하지 않아도 됩니다.**

NUNU는 ChatGPT 작업을 추적하고 완료되면 탭 상태, 데스크톱 알림, 사운드 또는 음성, 그리고 여러 ChatGPT 탭을 위한 작은 Task Inbox로 알려줍니다.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 독립적인 오픈소스 브라우저 확장 프로그램입니다. OpenAI의 공식 제품이나 보증 제품이 아닙니다.

## 10초면 사용법을 이해할 수 있습니다

1. ChatGPT에서 프롬프트를 보냅니다.
2. 다른 탭으로 이동해 작업을 계속합니다.
3. 실행 중에는 ChatGPT 탭에 `⏳`가 표시됩니다.
4. 완료되면 `✅`로 바뀌고 설정한 알림이 실행됩니다.
5. 알림이나 Task Inbox의 **Open**을 눌러 해당 ChatGPT 탭으로 바로 돌아갑니다.

```text
프롬프트 전송 → ⏳ 실행 중 → 다른 작업 → ✅ 완료 → 클릭 → 해당 task
```

## 왜 필요한가요?

ChatGPT 응답이 오래 걸리거나 여러 탭에서 동시에 작업하면 계속 돌아가 확인하는 일이 집중을 방해합니다. NUNU는 백그라운드 작업을 간단한 대기열처럼 다루고, 완료됐을 때만 알려줍니다.

## 주요 기능

- `⏳` — ChatGPT 작업 실행 중.
- `✅` — 백그라운드 작업이 완료되었고 아직 읽지 않음.
- 데스크톱 알림에서 정확한 작업 탭으로 이동.
- 확장 아이콘 badge에 unread 완료 작업 수 표시.
- Popup에서 **RUNNING** / **DONE / UNREAD** 확인.
- 여러 작업이 비슷한 시점에 끝나면 알림을 하나로 묶음.
- **Sound mode** — 사운드 선택, Preview, 볼륨, 반복, custom audio 업로드.
- **Voice mode** — 브라우저/OS speech synthesis로 완료 알림 읽기.
- Auto language: English, Tiếng Việt, 日本語, 한국어, 中文.
- 확장 프로그램 reload 후에도 task state 유지.

## Demo

공개용 데모 자료는 `docs/`에 둡니다.

- `docs/images/01-hero.png`
- `docs/images/02-sound-mode.png`
- `docs/images/03-voice-mode.png`
- `docs/images/04-task-inbox.png`
- `docs/images/05-notification.png`
- `docs/demo/demo.gif`

촬영 가이드: [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md)

## 설치

### Chrome Web Store

공개 릴리스 검토와 패키징이 끝난 뒤 추가할 예정입니다.

### 소스에서 직접 설치

1. 이 repository를 다운로드하거나 clone합니다.
2. `chrome://extensions`를 엽니다.
3. **Developer mode**를 켭니다.
4. **Load unpacked**를 클릭합니다.
5. `manifest.json`이 들어 있는 extension 폴더를 선택합니다.
6. **NUNU AI Task Notifier**를 toolbar에 고정합니다.
7. `https://chatgpt.com`에서 평소처럼 사용합니다.

## 사용법

### Sound mode

Popup → **Sound**.

- 기본 사운드 선택
- Preview 1회 재생
- 작은 custom audio 업로드
- 볼륨 조정
- task를 열 때까지 반복
- **Test alert**로 미리 확인

### Voice mode

**Voice**를 선택한 뒤 언어 또는 **Auto**를 선택합니다.

브라우저/OS에 적절한 voice가 있으면 NUNU가 완료 알림을 읽습니다. 사용 가능한 voice는 브라우저와 운영체제에 따라 다릅니다.

## 활성 탭에서는 조용히

응답이 끝날 때 사용자가 정확히 그 ChatGPT 탭을 보고 있다면 NUNU는 의도적으로 알림을 보내지 않습니다.

백그라운드에서 끝난 task만 unread가 되고 설정된 alert를 실행합니다.

## 여러 ChatGPT 작업

여러 ChatGPT 탭을 동시에 실행할 수 있으며 각 탭은 독립적으로 추적됩니다.

여러 작업이 거의 동시에 끝나면 사운드/음성이 겹치지 않도록 alert를 묶습니다.

## Privacy

NUNU는 local-first 방식으로 설계되었습니다.

- NUNU 계정 없음
- NUNU 서버 없음
- 광고 없음
- 기본 analytics 없음
- 사용자 데이터 판매 없음
- settings와 task state는 Chrome local storage에 저장
- 사이트 접근은 `https://chatgpt.com/*`로 제한

Voice playback은 browser/OS가 제공하는 speech synthesis를 사용하며 일부 voice는 network-backed일 수 있습니다.

자세히: [PRIVACY.md](PRIVACY.md)

## Permissions

- `notifications` — 완료 알림.
- `storage` — 설정, unread state, optional custom audio 저장.
- `webRequest` — ChatGPT request 완료 관찰. 차단하거나 수정하지 않음.
- `offscreen` — popup이 닫힌 상태에서 audio/speech 재생.
- `scripting` — 필요할 때 ChatGPT content integration 복구.
- `https://chatgpt.com/*` — ChatGPT에만 사이트 접근 제한.

## Status

현재 unpacked Chrome extension으로 사용할 수 있습니다. Chrome Web Store 제출 전 TTS fallback warning, audio license, store assets 등을 마무리합니다.

## Contributing

Bug report, 호환성 보고, 번역, pull request를 환영합니다. [CONTRIBUTING.md](CONTRIBUTING.md)

## License

소스 코드는 MIT License로 공개합니다. Audio asset은 별도 license일 수 있으며 재배포 권한이 명확하지 않은 경우 public release에 포함하지 않습니다.
