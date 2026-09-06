# Privacy Policy — NUNU AI Task Notifier

Last updated: 2026-09-05

NUNU AI Task Notifier is designed as a local-first browser extension whose single purpose is to notify users when ChatGPT tasks finish.

## What the extension accesses

The extension is limited to `https://chatgpt.com/*` and uses browser extension APIs needed to detect task completion, update tab state, show notifications, play sound/voice alerts, and remember user settings.

## Data stored locally

The extension may store the following in Chrome local/session storage:

- alert mode and language preference;
- volume and loop settings;
- selected notification sound;
- optional custom notification audio uploaded by the user;
- running/unread task state;
- lightweight task metadata needed for the Task Inbox, such as tab ID, title, prompt preview, language, and timestamps.

This data is used only to provide extension functionality.

## Data collection and sharing

NUNU does not operate a backend server for extension data.

NUNU does not sell user data.

NUNU does not include advertising or analytics by default.

The extension does not intentionally transmit ChatGPT conversation content to a NUNU-controlled server.

## Data processed locally

To provide its task-tracking features, NUNU may process the following data locally in the user's browser:

- Personal communications, such as the user's ChatGPT prompt and response text needed to identify and track a task;
- Website content from chatgpt.com, such as conversation titles and rendered message text;
- User activity related to NUNU's task state, such as whether the relevant ChatGPT tab is visible, active, or has been reopened.

This information is processed only to provide NUNU's task tracking, notification, language detection, and Task Inbox features.

NUNU does not transmit this information to a NUNU-controlled server.

## Speech synthesis

Voice mode uses speech synthesis provided by the browser or operating system. Depending on the installed voice, speech processing may be local or network-backed by that browser/OS speech provider. NUNU does not control those third-party speech engines.

## Permissions

- `notifications` — show task-completion notifications.
- `storage` — store extension settings, task state, and optional custom audio.
- `webRequest` — observe completion of relevant ChatGPT conversation requests. The extension does not use this permission to block or modify those requests.
- `offscreen` — enable background audio and speech playback when the popup is closed.
- `scripting` — restore the extension's ChatGPT content integration when needed.
- `https://chatgpt.com/*` — limit site access to ChatGPT.

## Third-party service

The extension operates on ChatGPT, a service provided by OpenAI. NUNU AI Task Notifier is an independent project and is not affiliated with or endorsed by OpenAI.

## Changes

If the extension later adds analytics, remote services, or any new data-processing behavior, this privacy policy will be updated before that behavior is released.

## Contact

For privacy questions, bug reports, or security concerns, open an issue in this repository:

https://github.com/nounou176/nunu-ai-task-notifier/issues
