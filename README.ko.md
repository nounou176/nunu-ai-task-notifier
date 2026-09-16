# 🔔 NUNU AI Task Notifier

**ChatGPT 끝났어? NUNU가 알려줄게. 🔔**

프롬프트 보내고 다른 탭으로 가세요. 끝나면 NUNU가 알려줍니다.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> 독립 오픈소스 확장 프로그램입니다. OpenAI 공식 제품이 아닙니다.

<table align="center">
<tr>
<td align="center">
<img src="docs/images/readme/overview.png" width="800" alt="NUNU AI Task Notifier — ChatGPT 작업 완료를 탭에 표시">
</td>
</tr>
</table>

<table align="center">
<tr>
<td align="center">
<a href="https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl">
<img src="https://img.shields.io/badge/Chrome%20Web%20Store-%EC%A7%80%EA%B8%88%20%EC%84%A4%EC%B9%98-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome 웹 스토어에서 NUNU AI Task Notifier 설치">
</a>
</td>
</tr>
</table>

## 사용법

1. Prompt 전송.
2. 다른 일 하기.
3. `⏳` 작업 중.
4. `✅` 완료.
5. 클릭 → task로 돌아가기.

```text
Prompt → ⏳ → 다른 일 → ✅ → 클릭
```

<table align="center">
<tr>
<td align="center" width="33%">
<img src="docs/images/readme/1.png" width="260" alt="ChatGPT가 작업 중일 때 탭에 모래시계 아이콘 표시"><br>
<sub><b>1. `⏳` 작업 중</b><br>탭 아이콘이 바뀌면 다른 일을 하세요</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/2.png" width="260" alt="작업이 끝나면 탭에 초록색 체크 표시"><br>
<sub><b>2. `✅` 완료</b><br>아이콘이 바뀌어 작업 완료를 알려줍니다</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/3.png" width="260" alt="데스크톱 알림을 클릭하면 작업 탭으로 이동"><br>
<sub><b>3. 🔔 클릭 → 돌아가기</b><br>알림을 클릭하면 해당 탭으로 이동합니다</sub>
</td>
</tr>
</table>

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

### Chrome 웹 스토어 (권장)

[NUNU AI Task Notifier 설치 →](https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl)

설치 후 NUNU를 툴바에 고정하면 빠르게 열 수 있습니다.

<table width="640">
<tr>
<th align="center" width="50%">1. 확장 프로그램 고정</th>
<th align="center" width="50%">2. 툴바에서 NUNU 열기</th>
</tr>
<tr>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pin.png" width="300" alt="퍼즐 아이콘을 클릭한 뒤 핀을 눌러 NUNU를 툴바에 고정">
</td>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pinned.png" width="200" alt="Chrome 툴바에 고정된 NUNU 아이콘">
</td>
</tr>
<tr>
<td align="center" valign="top">
<sub><b>퍼즐 아이콘</b> → NUNU 옆의 <b>핀</b> 클릭.</sub>
</td>
<td align="center" valign="top">
<sub><b>NUNU</b> 아이콘을 눌러 설정을 여세요.</sub>
</td>
</tr>
</table>

팝업 설정 화면:

<table>
<tr>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-sound.png" width="260" alt="NUNU Sound 설정: 알림음, 볼륨, 반복">
</td>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-voice.png" width="260" alt="NUNU Voice 설정: 음성 언어, 볼륨">
</td>
</tr>
<tr>
<td align="left" valign="top">
<sub><b>Sound</b> — 알림음, 볼륨, 반복 설정</sub>
</td>
<td align="left" valign="top">
<sub><b>Voice</b> — 음성 언어, 볼륨 설정</sub>
</td>
</tr>
</table>

<details>
<summary><b>소스에서 설치 (개발자용)</b></summary>

1. Repo clone/download.
2. `chrome://extensions` 열기.
3. **Developer mode** 켜기.
4. **Load unpacked**.
5. `manifest.json` folder 선택.
6. NUNU pin.
7. `https://chatgpt.com` 열기.

끝. 🎉

</details>

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

## Contributing

Bug, 번역, PR 모두 환영합니다.

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Third-party audio는 별도 license일 수 있습니다.  
[LICENSE](LICENSE) / [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
