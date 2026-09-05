# 🔔 NUNU AI Task Notifier

**ChatGPT xong? NUNU ping bạn. 🔔**

Gửi task. Chuyển tab. NUNU báo khi xong.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> Extension mã nguồn mở độc lập. Không thuộc OpenAI.

## Dùng thế nào?

1. Gửi prompt.
2. Đi làm việc khác.
3. `⏳` Đang chạy.
4. `✅` Xong.
5. Bấm → quay lại task.

```text
Prompt → ⏳ → đi làm việc khác → ✅ → bấm
```

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

### Chrome Web Store

Sắp có.

### Cài từ source

1. Clone/download repo.
2. Mở `chrome://extensions`.
3. Bật **Developer mode**.
4. Bấm **Load unpacked**.
5. Chọn folder có `manifest.json`.
6. Pin NUNU.
7. Mở `https://chatgpt.com`.

Xong. 🎉

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

## Trạng thái

Hiện dùng được dạng unpacked Chrome extension.

Bước tiếp theo: Chrome Web Store.

## Contributing

Bug, bản dịch và PR đều welcome.

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

Source code: MIT.

Audio bên thứ ba có thể dùng license riêng.  
Xem [LICENSE](LICENSE) và [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
