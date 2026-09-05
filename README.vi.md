# 🔔 NUNU AI Task Notifier

**Không cần liên tục quay lại kiểm tra các tab ChatGPT.**

NUNU theo dõi các tác vụ ChatGPT của bạn và báo khi chúng hoàn tất — bằng trạng thái trên tab, thông báo desktop, âm thanh hoặc giọng nói, cùng một Task Inbox nhỏ để quản lý nhiều tab ChatGPT cùng lúc.

[English](README.md) · [Tiếng Việt](README.vi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh-CN.md)

> Đây là extension mã nguồn mở độc lập, không thuộc và không được OpenAI chứng thực.

## Nhìn 10 giây là biết dùng

1. Gửi prompt trong ChatGPT.
2. Chuyển sang tab khác và tiếp tục làm việc.
3. NUNU đánh dấu tab ChatGPT bằng `⏳` khi đang chạy.
4. Khi xong, NUNU đổi sang `✅` và phát cảnh báo.
5. Bấm notification hoặc **Open** trong Task Inbox để quay lại đúng tab ChatGPT đó.

```text
Gửi prompt → ⏳ đang chạy → làm việc khác → ✅ hoàn tất → bấm → đúng task
```

## Vì sao nên dùng?

Khi ChatGPT trả lời lâu hoặc bạn chạy nhiều tab cùng lúc, việc liên tục quay lại kiểm tra rất dễ làm mất tập trung. NUNU biến các tác vụ nền thành một hàng đợi đơn giản: cứ làm việc khác, khi nào xong thì extension báo.

## NUNU làm được gì?

- `⏳` = task ChatGPT vẫn đang chạy.
- `✅` = task nền đã xong nhưng bạn chưa mở lại.
- Desktop notification có thể mở đúng task vừa hoàn tất.
- Badge trên icon hiển thị số task chưa đọc.
- Popup có hai khu vực **RUNNING** và **DONE / UNREAD**.
- Nhiều task hoàn tất gần nhau sẽ được gộp thành một cảnh báo, tránh chồng âm thanh.
- **Sound mode**: chọn âm thanh, Preview, chỉnh volume, loop đến khi đọc, upload âm thanh riêng.
- **Voice mode**: đọc cảnh báo bằng speech synthesis của browser/OS.
- Auto language hỗ trợ English, Tiếng Việt, 日本語, 한국어, 中文.
- Trạng thái task vẫn được giữ khi reload extension.

## Demo

Các asset public nằm trong `docs/`:

- `docs/images/01-hero.png` — nhiều tab ChatGPT + notification
- `docs/images/02-sound-mode.png` — Sound mode
- `docs/images/03-voice-mode.png` — Voice mode
- `docs/images/04-task-inbox.png` — Running và Done/Unread
- `docs/images/05-notification.png` — desktop notification
- `docs/demo/demo.gif` — toàn bộ workflow

Hướng dẫn chụp ảnh: [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md)

## Cài nhanh

### Chrome Web Store

Bản Chrome Web Store sẽ được thêm sau khi hoàn tất review và đóng gói public release.

### Cài thủ công từ source

1. Tải hoặc clone repository này.
2. Mở `chrome://extensions`.
3. Bật **Developer mode**.
4. Bấm **Load unpacked**.
5. Chọn thư mục extension có `manifest.json`.
6. Pin **NUNU AI Task Notifier** lên toolbar.
7. Mở `https://chatgpt.com` và dùng ChatGPT bình thường.

## Cách dùng

### Sound mode

Mở popup NUNU → chọn **Sound**.

Bạn có thể:
- chọn sound có sẵn;
- Preview một lần;
- upload custom sound nhỏ;
- chỉnh volume;
- bật loop đến khi task được mở;
- dùng **Test alert** trước khi làm việc.

### Voice mode

Chọn **Voice**, sau đó chọn ngôn ngữ hoặc **Auto**.

Nếu browser/OS có voice phù hợp, NUNU sẽ đọc cảnh báo hoàn tất. Voice khả dụng phụ thuộc browser và hệ điều hành. Fallback đa ngôn ngữ nhẹ hơn sẽ được bổ sung sau cho máy thiếu voice tương ứng.

## Khi nào NUNU im lặng?

Nếu bạn đang nhìn đúng tab ChatGPT tại thời điểm câu trả lời hoàn tất, NUNU cố ý không cảnh báo.

Nếu task hoàn tất ở background, nó sẽ thành unread và kích hoạt alert theo cấu hình.

## Nhiều task cùng lúc

Bạn có thể chạy nhiều tab ChatGPT. Mỗi tab được theo dõi riêng.

Nếu nhiều task xong gần nhau, NUNU sẽ gộp cảnh báo thay vì phát nhiều sound/voice chồng nhau.

## Privacy

NUNU được thiết kế theo hướng local-first:

- không cần tài khoản NUNU;
- không có server NUNU;
- không quảng cáo;
- không analytics mặc định;
- không bán dữ liệu người dùng;
- settings và task state được lưu trong Chrome local storage;
- quyền truy cập chỉ giới hạn ở `https://chatgpt.com/*`.

Voice dùng speech synthesis do browser hoặc hệ điều hành cung cấp. Một số voice cài sẵn có thể là network-backed.

Xem đầy đủ: [PRIVACY.md](PRIVACY.md)

## Permissions

- `notifications` — hiện thông báo khi task hoàn tất.
- `storage` — lưu settings, unread state và custom audio tùy chọn.
- `webRequest` — quan sát việc request ChatGPT hoàn tất; không block và không sửa request.
- `offscreen` — phát audio/TTS khi popup đóng.
- `scripting` — khôi phục content integration với ChatGPT khi cần.
- `https://chatgpt.com/*` — giới hạn site access chỉ ở ChatGPT.

## Trạng thái hiện tại

Extension hiện dùng được ở chế độ unpacked. Trước khi submit Chrome Web Store, dự án còn một số việc release-hardening như dọn warning TTS fallback, kiểm tra audio license và hoàn thiện store assets.

## Development

```text
manifest.json
background.js
content.js
offscreen.html
offscreen.js
popup.html
popup.css
popup.js
sounds/
```

Extension dùng Manifest V3 và không cần backend server riêng.

## Contributing

Bug report, compatibility report, bản dịch và pull request đều được chào đón. Xem [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Source code phát hành theo MIT License. Audio có thể có license riêng và không nên redistribute nếu license chưa được ghi rõ trong repository.
