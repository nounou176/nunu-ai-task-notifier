# 🔔 NUNU AI Task Notifier

**ChatGPT xong? NUNU ping bạn. 🔔**

Gửi task. Chuyển tab. NUNU báo khi xong.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> Extension mã nguồn mở độc lập. Không thuộc OpenAI.

<table align="center">
<tr>
<td align="center">
<img src="docs/images/readme/overview.png" width="800" alt="NUNU AI Task Notifier - tab báo khi task ChatGPT chạy xong">
</td>
</tr>
</table>

<table align="center">
<tr>
<td align="center">
<a href="https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl">
<img src="https://img.shields.io/badge/Chrome%20Web%20Store-Cài%20đặt%20ngay-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Cài NUNU AI Task Notifier trên Chrome Web Store">
</a>
</td>
</tr>
</table>

## Dùng thế nào?

1. Gửi prompt.
2. Đi làm việc khác.
3. `⏳` Đang chạy.
4. `✅` Xong.
5. Bấm → quay lại task.

```text
Prompt → ⏳ → đi làm việc khác → ✅ → bấm
```

<table align="center">
<tr>
<td align="center" width="33%">
<img src="docs/images/readme/1.png" width="260" alt="Tab hiện icon đồng hồ cát khi ChatGPT đang chạy"><br>
<sub><b>1. `⏳` Đang chạy</b><br>Tab đổi icon, cứ để đó đi làm việc khác</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/2.png" width="260" alt="Tab đổi sang dấu tick xanh khi task xong"><br>
<sub><b>2. `✅` Xong</b><br>Icon đổi màu, báo task đã hoàn tất</sub>
</td>
<td align="center" width="33%">
<img src="docs/images/readme/3.png" width="260" alt="Desktop notification, bấm để quay lại tab task"><br>
<sub><b>3. 🔔 Bấm → quay lại</b><br>Notification hiện ra, bấm là nhảy đúng tab</sub>
</td>
</tr>
</table>

## Vì sao?

Vì check ChatGPT mỗi 10 giây hơi mệt.

NUNU canh tab. Bạn khỏi canh.

## Có gì?

- `⏳` Đang chạy
- `✅` Xong / chưa đọc
- 🔔 Desktop notification
- 🔊 Sound alert
- 🗣️ Voice alert
- 📥 Task Inbox nhiều tab
- 🔢 Badge đếm task
- 🧹 Gộp alert gần nhau
- 🌏 Auto language: EN / VI / JA / KO / ZH
- 💾 Reload vẫn nhớ task

## Cài đặt

### Chrome Web Store (khuyên dùng)

[Cài NUNU AI Task Notifier →](https://chromewebstore.google.com/detail/nunu-ai-task-notifier/kkejgnpiempejoladofoaaaifahfcjcl)

Ghim NUNU lên toolbar để mở nhanh sau khi cài đặt:

<table width="640">
<tr>
<th align="center" width="50%">1. Ghim tiện ích</th>
<th align="center" width="50%">2. Mở NUNU từ toolbar</th>
</tr>
<tr>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pin.png" width="300" alt="Bấm icon puzzle piece rồi bấm Pin để ghim NUNU lên toolbar">
</td>
<td align="center" valign="middle" width="50%">
<img src="docs/images/readme/install-pinned.png" width="200" alt="Icon NUNU đã ghim sẵn trên toolbar Chrome">
</td>
</tr>
<tr>
<td align="center" valign="top">
<sub>Bấm <b>puzzle piece</b> → <b>Pin</b> cạnh NUNU.</sub>
</td>
<td align="center" valign="top">
<sub>Bấm icon <b>NUNU</b> để mở cấu hình.</sub>
</td>
</tr>
</table>

Giao diện cấu hình trong popup:

<table>
<tr>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-sound.png" width="260" alt="Popup NUNU tab Sound: chọn âm thanh, volume, loop">
</td>
<td align="left" valign="top" width="50%">
<img src="docs/images/readme/popup-voice.png" width="260" alt="Popup NUNU tab Voice: chọn ngôn ngữ đọc, volume">
</td>
</tr>
<tr>
<td align="left" valign="top">
<sub><b>Sound</b> — chọn âm thanh, volume, loop</sub>
</td>
<td align="left" valign="top">
<sub><b>Voice</b> — chọn ngôn ngữ đọc, volume</sub>
</td>
</tr>
</table>

<details>
<summary><b>Cài từ source (cho dev)</b></summary>

1. Clone/download repo.
2. Mở `chrome://extensions`.
3. Bật **Developer mode**.
4. Bấm **Load unpacked**.
5. Chọn folder có `manifest.json`.
6. Pin NUNU.
7. Mở `https://chatgpt.com`.

Xong. 🎉

</details>

## Sound

NUNU → **Sound**

Chọn tiếng, preview, chỉnh volume, loop hoặc upload sound riêng.

## Voice

NUNU → **Voice**

Chọn ngôn ngữ hoặc **Auto**.  
Voice tùy browser/OS.

## Đang ở đúng tab?

NUNU im lặng.

Task chạy nền? Ping. 🔔

## Nhiều task?

Có luôn.

Mỗi tab ChatGPT được theo dõi riêng.  
Nhiều task xong cùng lúc → gộp alert cho gọn.

## Privacy

Local-first:

- không cần tài khoản NUNU
- không backend NUNU
- không quảng cáo
- mặc định không analytics
- không bán dữ liệu
- settings lưu trong Chrome local storage
- chỉ truy cập `https://chatgpt.com/*`

Voice dùng speech synthesis của browser/OS. Một số voice có thể cần mạng.

Chi tiết: [PRIVACY.md](PRIVACY.md)

## Permissions

Chỉ xin quyền cần dùng:

- `notifications` — báo task xong
- `storage` — settings + task state
- `webRequest` — phát hiện request hoàn tất
- `offscreen` — sound/voice chạy nền
- `scripting` — khôi phục integration khi cần
- `https://chatgpt.com/*` — chỉ ChatGPT

NUNU không block hoặc sửa request ChatGPT.

## Contributing

Bug, bản dịch và PR đều welcome.

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Audio bên thứ ba có thể dùng license riêng.  
Xem [LICENSE](LICENSE) và [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
