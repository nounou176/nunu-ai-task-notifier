const tasks = new Map();

// Tasks currently being generated.
// DONE_UNREAD remains in `tasks`; active generations live here.
const runningTasks = new Map();

// Defense-in-depth completion dedupe.
// content.js already deduplicates, but background also protects
// task/badge/notification state from duplicate completion events.
const lastCompletionFingerprintByTab = new Map();

// Remember the latest reliable conversation language per tab.
// This prevents tiny prompts such as "yes", "ok", "1", etc.
// from unexpectedly switching Auto Voice to English.
const lastReliableLanguageByTab = new Map();

const DEFAULT_SETTINGS = Object.freeze({
  alertMode: "sound",
  language: "auto",
  soundLoop: true,
  volume: 1,
  selectedSound: "default-ding"
});

const CUSTOM_SOUND_STORAGE_KEY =
  "nunuCustomSoundV1";

const SOUND_LIBRARY =
  Object.freeze({
    "default-ding":
      "sounds/default-ding.mp3",
    "okay":
      "sounds/okay.mp3",
    "suspense":
      "sounds/suspense.mp3",
    "omg-wow":
      "sounds/omg-wow.mp3",
    "correct":
      "sounds/correct.mp3"
  });

let settings = {
  ...DEFAULT_SETTINGS
};


async function initializeSettings() {
  try {
    const keys = Object.keys(DEFAULT_SETTINGS);

    const stored =
      await chrome.storage.local.get(keys);

    const missing = {};

    for (const key of keys) {
      if (stored[key] === undefined) {
        missing[key] = DEFAULT_SETTINGS[key];
      }
    }

    if (Object.keys(missing).length > 0) {
      await chrome.storage.local.set(missing);
    }

    settings = {
      ...DEFAULT_SETTINGS,
      ...stored,
      ...missing
    };

    console.log(
      "NUNU: settings loaded",
      settings
    );
  } catch (error) {
    console.error(
      "NUNU settings init:",
      error
    );

    settings = {
      ...DEFAULT_SETTINGS
    };
  }
}


const settingsReady =
  initializeSettings();


chrome.storage.onChanged.addListener(
  (changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    for (
      const key of Object.keys(DEFAULT_SETTINGS)
    ) {
      if (!changes[key]) {
        continue;
      }

      settings[key] =
        changes[key].newValue ??
        DEFAULT_SETTINGS[key];
    }

    console.log(
      "NUNU: settings changed",
      settings
    );
  }
);


const TASK_STATE_STORAGE_KEY =
  "nunuTaskStateV1";


async function persistTaskState() {
  try {
    const doneTasks =
      Array.from(tasks.values())
        .map((task) => ({
          tabId: task.tabId,
          windowId: task.windowId,
          title: task.title || "ChatGPT",
          prompt: task.prompt || "",
          language: task.language || "en",
          status: "DONE_UNREAD",
          finishedAt:
            Number(task.finishedAt || 0)
        }));

    const languages =
      Object.fromEntries(
        lastReliableLanguageByTab
      );

    await chrome.storage.local.set({
      [TASK_STATE_STORAGE_KEY]: {
        doneTasks,
        languages
      }
    });
  } catch (error) {
    console.error(
      "NUNU persist task state:",
      error
    );
  }
}


async function restoreTaskState() {
  try {
    const stored =
      await chrome.storage.local.get(
        TASK_STATE_STORAGE_KEY
      );

    const state =
      stored[TASK_STATE_STORAGE_KEY];

    if (!state) {
      await updateUnreadBadge();
      return;
    }


    // Restore language memory only for tabs
    // that still exist.
    const storedLanguages =
      state.languages &&
      typeof state.languages === "object"
        ? state.languages
        : {};

    for (
      const [rawTabId, language]
      of Object.entries(storedLanguages)
    ) {
      const tabId =
        Number(rawTabId);

      if (!Number.isInteger(tabId)) {
        continue;
      }

      try {
        await chrome.tabs.get(tabId);

        const normalized =
          normalizeDetectedLanguage(
            language
          );

        lastReliableLanguageByTab.set(
          tabId,
          normalized
        );
      } catch {
        // Closed/stale tab.
      }
    }


    // Restore unread completed tasks only if
    // their Chrome tab still exists.
    const storedTasks =
      Array.isArray(state.doneTasks)
        ? state.doneTasks
        : [];

    for (const saved of storedTasks) {
      const tabId =
        Number(saved?.tabId);

      if (!Number.isInteger(tabId)) {
        continue;
      }

      try {
        const tab =
          await chrome.tabs.get(tabId);

        const task = {
          tabId,
          windowId:
            Number.isInteger(
              saved?.windowId
            )
              ? saved.windowId
              : tab.windowId,

          title:
            cleanTaskTitle(
              saved?.title ||
              tab.title ||
              "ChatGPT"
            ),

          prompt:
            cleanPrompt(
              saved?.prompt
            ),

          language:
            normalizeDetectedLanguage(
              saved?.language
            ),

          status: "DONE_UNREAD",

          finishedAt:
            Number(
              saved?.finishedAt ||
              Date.now()
            )
        };

        tasks.set(
          tabId,
          task
        );

        lastReliableLanguageByTab.set(
          tabId,
          task.language
        );
      } catch {
        // Tab no longer exists.
      }
    }


    await updateUnreadBadge();


    // Restore ✅ title state, but do NOT recreate
    // old desktop notifications.
    for (const task of tasks.values()) {
      await sendTaskStatus(
        task.tabId,
        "DONE_UNREAD",
        task.title
      );
    }


    // Rewrite once to remove stale closed tabs.
    await persistTaskState();

    console.log(
      `NUNU: restored ${tasks.size} unread task(s)`
    );
  } catch (error) {
    console.error(
      "NUNU restore task state:",
      error
    );

    await updateUnreadBadge();
  }
}


const taskStateReady =
  restoreTaskState();


const RUNNING_STATE_STORAGE_KEY =
  "nunuRunningStateV1";


async function persistRunningState() {
  try {
    const running =
      Array.from(
        runningTasks.values()
      ).map((task) => ({
        tabId: task.tabId,
        windowId: task.windowId,
        title: task.title || "ChatGPT",
        prompt: task.prompt || "",
        language: task.language || "",
        status: "RUNNING",
        startedAt:
          Number(task.startedAt || 0)
      }));

    await chrome.storage.session.set({
      [RUNNING_STATE_STORAGE_KEY]:
        running
    });
  } catch (error) {
    console.error(
      "NUNU persist running state:",
      error
    );
  }
}


async function restoreRunningState() {
  try {
    const stored =
      await chrome.storage.session.get(
        RUNNING_STATE_STORAGE_KEY
      );

    const savedTasks =
      Array.isArray(
        stored[
          RUNNING_STATE_STORAGE_KEY
        ]
      )
        ? stored[
            RUNNING_STATE_STORAGE_KEY
          ]
        : [];

    const now = Date.now();

    for (const saved of savedTasks) {
      const tabId =
        Number(saved?.tabId);

      const startedAt =
        Number(
          saved?.startedAt || 0
        );

      if (!Number.isInteger(tabId)) {
        continue;
      }

      // A RUNNING state several hours old is
      // almost certainly stale.
      if (
        startedAt &&
        now - startedAt >
          6 * 60 * 60 * 1000
      ) {
        continue;
      }

      try {
        const tab =
          await chrome.tabs.get(tabId);

        if (
          !String(tab.url || "")
            .startsWith(
              "https://chatgpt.com/"
            )
        ) {
          continue;
        }

        runningTasks.set(
          tabId,
          {
            tabId,
            windowId:
              Number.isInteger(
                saved?.windowId
              )
                ? saved.windowId
                : tab.windowId,

            title:
              cleanTaskTitle(
                saved?.title ||
                tab.title ||
                "ChatGPT"
              ),

            prompt:
              cleanPrompt(
                saved?.prompt
              ),

            language:
              String(
                saved?.language || ""
              ),

            status: "RUNNING",

            startedAt:
              startedAt ||
              Date.now()
          }
        );
      } catch {
        // Tab no longer exists.
      }
    }


    for (
      const task of
      runningTasks.values()
    ) {
      await sendTaskStatus(
        task.tabId,
        "RUNNING",
        task.title
      );
    }


    // Rewrite once to purge stale tabs/tasks.
    await persistRunningState();

    console.log(
      `NUNU: restored ${runningTasks.size} running task(s)`
    );
  } catch (error) {
    console.error(
      "NUNU restore running state:",
      error
    );
  }
}


const runningStateReady =
  restoreRunningState();


async function hasOffscreenDocument() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"]
  });

  return contexts.length > 0;
}


async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Play a sound when ChatGPT finishes responding."
  });
}


async function resolveSoundSource(
  soundId =
    settings.selectedSound
) {
  const requested =
    String(
      soundId ||
      "default-ding"
    );

  if (requested === "custom") {
    try {
      const stored =
        await chrome.storage.local.get(
          CUSTOM_SOUND_STORAGE_KEY
        );

      const custom =
        stored[
          CUSTOM_SOUND_STORAGE_KEY
        ];

      if (
        typeof custom?.dataUrl ===
          "string" &&
        custom.dataUrl.startsWith(
          "data:audio/"
        )
      ) {
        return custom.dataUrl;
      }
    } catch (error) {
      console.error(
        "NUNU custom sound load:",
        error
      );
    }
  }

  const relativePath =
    SOUND_LIBRARY[requested] ||
    SOUND_LIBRARY["default-ding"];

  return chrome.runtime.getURL(
    relativePath
  );
}


async function playSound(
  loop = false,
  volume = 1,
  soundId =
    settings.selectedSound
) {
  try {
    await ensureOffscreenDocument();

    const source =
      await resolveSoundSource(
        soundId
      );

    chrome.runtime.sendMessage({
      type: "PLAY_NUNU_SOUND",
      loop,
      volume,
      source
    });
  } catch (error) {
    console.error(
      "NUNU ChatGPT Ping:",
      error
    );
  }
}


async function stopSound() {
  try {
    if (!(await hasOffscreenDocument())) {
      return;
    }

    chrome.runtime.sendMessage({
      type: "STOP_NUNU_SOUND"
    });
  } catch (error) {
    console.error("NUNU ChatGPT Ping stop:", error);
  }
}


async function speakText(
  text,
  language = "",
  volume = 1
) {
  try {
    await ensureOffscreenDocument();

    chrome.runtime.sendMessage({
      type: "SPEAK_NUNU_TEXT",
      text,
      language,
      volume
    });
  } catch (error) {
    console.error(
      "NUNU speech:",
      error
    );
  }
}


async function stopAlert() {
  try {
    if (!(await hasOffscreenDocument())) {
      return;
    }

    chrome.runtime.sendMessage({
      type: "STOP_NUNU_ALERT"
    });
  } catch (error) {
    console.error(
      "NUNU stop alert:",
      error
    );
  }
}


function truncateText(text, maxChars = 220) {
  const normalized = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "Task completed.";
  }

  if (normalized.length <= maxChars) {
    return normalized;
  }

  return normalized.slice(0, maxChars - 3).trimEnd() + "...";
}


async function showTaskNotification(task) {
  try {
    const notificationId =
      `nunu-task:${task.tabId}:${Date.now()}`;

    await chrome.notifications.create(
      notificationId,
      {
        type: "basic",
        iconUrl: "icon128.png",
        title: `✅ ${task.title || "ChatGPT"}`,
        message: truncateText(
          task.prompt || "Task completed."
        ),
        contextMessage: "Click to open this ChatGPT task",
        priority: 2,
        requireInteraction: false,
        silent: true
      }
    );

    return notificationId;
  } catch (error) {
    console.error(
      "NUNU notification create:",
      error
    );

    return null;
  }
}


const SUMMARY_NOTIFICATION_ID =
  "nunu-summary";


async function clearSummaryNotification() {
  try {
    await chrome.notifications.clear(
      SUMMARY_NOTIFICATION_ID
    );
  } catch {}
}


async function clearTaskNotifications() {
  const pending = [];

  for (const task of tasks.values()) {
    if (!task.notificationId) {
      continue;
    }

    pending.push(
      chrome.notifications
        .clear(task.notificationId)
        .catch(() => {})
    );

    task.notificationId = null;
  }

  await Promise.all(pending);
}


function buildSummaryNotificationTitle(
  language,
  count
) {
  const titles = {
    vi: `✅ ${count} task đã xong`,
    en: `✅ ${count} tasks completed`,
    ja: `✅ ${count}件のタスクが完了`,
    ko: `✅ ${count}개 작업 완료`,
    zh: `✅ ${count} 个任务已完成`
  };

  return (
    titles[language] ||
    titles.en
  );
}


async function showSummaryNotification() {
  const count = tasks.size;

  if (count < 2) {
    return null;
  }

  try {
    const language =
      getAlertLanguage();

    await chrome.notifications.create(
      SUMMARY_NOTIFICATION_ID,
      {
        type: "basic",
        iconUrl: "icon128.png",

        title:
          buildSummaryNotificationTitle(
            language,
            count
          ),

        message:
          buildVoiceMessage(
            language
          ),

        contextMessage:
          "Click to open Task Inbox",

        priority: 2,
        requireInteraction: false,
        silent: true
      }
    );

    return SUMMARY_NOTIFICATION_ID;
  } catch (error) {
    console.error(
      "NUNU summary notification:",
      error
    );

    return null;
  }
}


async function emitAggregatedNotification() {
  if (tasks.size === 0) {
    await clearSummaryNotification();
    await clearTaskNotifications();
    return;
  }

  // Remove notifications from an older aggregation state.
  await clearSummaryNotification();
  await clearTaskNotifications();

  if (tasks.size === 1) {
    const task =
      Array.from(tasks.values())[0];

    task.notificationId =
      await showTaskNotification(task);

    return;
  }

  await showSummaryNotification();
}


async function updateUnreadBadge() {
  try {
    const count = tasks.size;

    await chrome.action.setBadgeText({
      text: count > 0 ? String(count) : ""
    });
  } catch (error) {
    console.error("NUNU badge update:", error);
  }
}


async function ensureContentScript(tabId) {
  try {
    const tab =
      await chrome.tabs.get(tabId);

    if (
      !String(tab.url || "")
        .startsWith(
          "https://chatgpt.com/"
        )
    ) {
      return false;
    }

    // A recovered content script claims ownership through
    // a shared DOM marker. Older instances become inert.
    await chrome.scripting.executeScript({
      target: {
        tabId
      },
      files: [
        "content.js"
      ]
    });

    console.log(
      `NUNU: content.js recovered in tab ${tabId}`
    );

    return true;
  } catch (error) {
    console.error(
      `NUNU: cannot inject content.js into tab ${tabId}:`,
      error
    );

    return false;
  }
}


async function sendMessageToChatGPTTab(
  tabId,
  message
) {
  try {
    return await chrome.tabs.sendMessage(
      tabId,
      message
    );
  } catch {
    // No receiver: recover by injecting content.js.
  }

  const injected =
    await ensureContentScript(tabId);

  if (!injected) {
    return null;
  }

  try {
    return await chrome.tabs.sendMessage(
      tabId,
      message
    );
  } catch (error) {
    console.error(
      `NUNU: message retry failed in tab ${tabId}:`,
      error
    );

    return null;
  }
}


async function sendTaskStatus(
  tabId,
  status,
  title = ""
) {
  await sendMessageToChatGPTTab(
    tabId,
    {
      type: "NUNU_TASK_STATUS",
      status,
      title
    }
  );
}


// Detect completion of ChatGPT conversation network requests.
// This is more reliable than watching the Stop button disappear.
const CHATGPT_REQUEST_FILTER = {
  urls: [
    "https://chatgpt.com/backend-api/f/conversation*",
    "https://chatgpt.com/backend-api/conversation*"
  ]
};

function normalizePathname(url) {
  try {
    return new URL(url).pathname.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

function isChatGPTAnswerRequest(details) {
  if (details.tabId < 0) {
    return false;
  }

  if (details.method !== "POST") {
    return false;
  }

  const path = normalizePathname(details.url);

  return (
    path === "/backend-api/f/conversation" ||
    path === "/backend-api/conversation"
  );
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isChatGPTAnswerRequest(details)) {
      return;
    }

    (async () => {
      try {
        await Promise.all([
          taskStateReady,
          runningStateReady
        ]);

        // Starting a new prompt means an older completed
        // task in this same tab has already been seen.
        if (tasks.has(details.tabId)) {
          await markTaskRead(details.tabId);
        }

        const tab =
          await chrome.tabs.get(
            details.tabId
          );

        const title =
          String(
            tab.title || "ChatGPT"
          )
            .replace(
              /^(?:⏳|✅)\s*/,
              ""
            )
            .replace(
              /\s*[-|–—]\s*ChatGPT\s*$/i,
              ""
            )
            .trim() ||
          "ChatGPT";

        runningTasks.set(
          details.tabId,
          {
            tabId: details.tabId,
            windowId: tab.windowId,
            title,
            prompt: "",
            language:
              lastReliableLanguageByTab.get(
                details.tabId
              ) || "",
            status: "RUNNING",
            startedAt: Date.now()
          }
        );

        await persistRunningState();

        console.log(
          `NUNU: task ${details.tabId} RUNNING`
        );

        await sendTaskStatus(
          details.tabId,
          "RUNNING",
          title
        );
      } catch (error) {
        console.error(
          "NUNU request-start state:",
          error
        );
      }
    })();
  },
  CHATGPT_REQUEST_FILTER
);


chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    if (!isChatGPTAnswerRequest(details)) {
      return;
    }

    runningTasks.delete(
      details.tabId
    );

    persistRunningState()
      .catch(() => {});

    sendTaskStatus(
      details.tabId,
      "IDLE"
    );

    console.log(
      `NUNU: task ${details.tabId} request ended with error`
    );
  },
  CHATGPT_REQUEST_FILTER
);


chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (!isChatGPTAnswerRequest(details)) {
      return;
    }

    if (
      details.statusCode < 200 ||
      details.statusCode >= 300
    ) {
      return;
    }

    console.log(
      `NUNU: conversation request completed in tab ${details.tabId}`
    );

    sendMessageToChatGPTTab(
      details.tabId,
      {
        type:
          "CHATGPT_CONVERSATION_REQUEST_COMPLETED"
      }
    ).catch((error) => {
      console.error(
        "NUNU completion message:",
        error
      );
    });
  },
  CHATGPT_REQUEST_FILTER
);


// A completed background ChatGPT tab becomes DONE_UNREAD.
function cleanTaskTitle(rawTitle) {
  const raw = String(rawTitle || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) {
    return "ChatGPT";
  }

  const cleaned = raw
    // Remove our own task-state prefixes first.
    .replace(/^(?:⏳|✅)\s*/, "")

    // Remove ChatGPT browser-title decoration.
    .replace(/\s*[-|–—]\s*ChatGPT\s*$/i, "")
    .replace(/^ChatGPT\s*[-|–—]\s*/i, "")

    .trim();

  return cleaned || "ChatGPT";
}


function cleanPrompt(rawPrompt) {
  return String(rawPrompt || "")
    .replace(/\s+/g, " ")
    .trim();
}


const SUPPORTED_TASK_LANGUAGES =
  new Set([
    "en",
    "vi",
    "ja",
    "ko",
    "zh"
  ]);


function normalizeDetectedLanguage(
  language
) {
  const base =
    String(language || "")
      .toLowerCase()
      .split("-")[0];

  if (
    SUPPORTED_TASK_LANGUAGES.has(base)
  ) {
    return base;
  }

  return "en";
}


function detectStrongScriptLanguage(text) {
  // Korean Hangul
  if (/[\uac00-\ud7af]/u.test(text)) {
    return "ko";
  }

  // Japanese Hiragana / Katakana
  if (/[\u3040-\u30ff]/u.test(text)) {
    return "ja";
  }

  // Vietnamese-specific characters.
  if (
    /[ăâđêôơưĂÂĐÊÔƠƯ]|[àáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/iu.test(
      text
    )
  ) {
    return "vi";
  }

  return "";
}


function promptHasEnoughLanguageSignal(text) {
  const cleaned =
    cleanPrompt(text);

  if (!cleaned) {
    return false;
  }

  if (detectStrongScriptLanguage(cleaned)) {
    return true;
  }

  const words =
    cleaned
      .split(/\s+/)
      .filter(Boolean);

  const letters =
    (
      cleaned.match(/\p{L}/gu) ||
      []
    ).length;

  return (
    words.length >= 3 ||
    letters >= 12
  );
}


function getSupportedDetectedLanguage(language) {
  const base =
    String(language || "")
      .toLowerCase()
      .split("-")[0];

  return SUPPORTED_TASK_LANGUAGES.has(base)
    ? base
    : "";
}


async function detectTaskLanguage(
  tabId,
  prompt
) {
  const text =
    cleanPrompt(prompt);

  const previousLanguage =
    lastReliableLanguageByTab.get(tabId) ||
    "";

  if (!text) {
    return previousLanguage || "en";
  }

  const strongScriptLanguage =
    detectStrongScriptLanguage(text);

  if (strongScriptLanguage) {
    lastReliableLanguageByTab.set(
      tabId,
      strongScriptLanguage
    );

    return strongScriptLanguage;
  }

  // Tiny follow-ups inherit the latest reliable
  // language of this ChatGPT tab.
  if (
    !promptHasEnoughLanguageSignal(text) &&
    previousLanguage
  ) {
    return previousLanguage;
  }

  try {
    const result =
      await new Promise((resolve) => {
        chrome.i18n.detectLanguage(
          text,
          resolve
        );
      });

    const languages =
      Array.isArray(result?.languages)
        ? result.languages
        : [];

    const supported =
      languages
        .map((item) => ({
          language:
            getSupportedDetectedLanguage(
              item?.language
            ),
          percentage:
            Number(
              item?.percentage || 0
            )
        }))
        .filter(
          item => item.language
        )
        .sort(
          (a, b) =>
            b.percentage -
            a.percentage
        );

    const best =
      supported[0];

    if (!best) {
      return previousLanguage || "en";
    }

    // Weak detection should not override
    // established conversation language.
    if (
      best.percentage < 50 &&
      previousLanguage
    ) {
      return previousLanguage;
    }

    lastReliableLanguageByTab.set(
      tabId,
      best.language
    );

    return best.language;
  } catch (error) {
    console.error(
      "NUNU language detection:",
      error
    );

    return previousLanguage || "en";
  }
}


// ------------------------------------------------------------
// Alert aggregation
//
// If several ChatGPT tasks finish close together,
// emit only one Sound/Voice alert.
// ------------------------------------------------------------

const ALERT_AGGREGATION_MS = 2500;

let alertAggregationTimer = null;


const SPEECH_LOCALES = {
  en: "en-US",
  vi: "vi-VN",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN"
};


function chooseAutoAlertLanguage() {
  const unreadTasks =
    Array.from(tasks.values());

  if (!unreadTasks.length) {
    return "en";
  }

  if (unreadTasks.length === 1) {
    return normalizeDetectedLanguage(
      unreadTasks[0].language
    );
  }

  const counts = new Map();

  for (const task of unreadTasks) {
    const language =
      normalizeDetectedLanguage(
        task.language
      );

    counts.set(
      language,
      (counts.get(language) || 0) + 1
    );
  }

  let highestCount = 0;
  let candidates = [];

  for (const [language, count] of counts) {
    if (count > highestCount) {
      highestCount = count;
      candidates = [language];
      continue;
    }

    if (count === highestCount) {
      candidates.push(language);
    }
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  // Tie:
  // prefer the language of the most recently finished task.
  const newestFirst =
    [...unreadTasks].sort(
      (a, b) =>
        (b.finishedAt || 0) -
        (a.finishedAt || 0)
    );

  for (const task of newestFirst) {
    const language =
      normalizeDetectedLanguage(
        task.language
      );

    if (candidates.includes(language)) {
      return language;
    }
  }

  return "en";
}


function getAlertLanguage() {
  if (
    settings.language &&
    settings.language !== "auto"
  ) {
    return normalizeDetectedLanguage(
      settings.language
    );
  }

  return chooseAutoAlertLanguage();
}


function getSpeechLocale(language) {
  return (
    SPEECH_LOCALES[language] ||
    "en-US"
  );
}


function buildVoiceTestMessage(language) {
  const messages = {
    vi: "NUNU đang hoạt động. Đây là thử nghiệm giọng nói.",
    en: "NUNU is working. This is a voice test.",
    ja: "NUNUは動作しています。これは音声テストです。",
    ko: "NUNU가 작동 중입니다. 음성 테스트입니다.",
    zh: "NUNU 正在运行。这是语音测试。"
  };

  return (
    messages[language] ||
    messages.en
  );
}


function buildVoiceMessage(language) {
  const unreadTasks =
    Array.from(tasks.values());

  if (!unreadTasks.length) {
    return "";
  }

  if (unreadTasks.length === 1) {
    return (
      unreadTasks[0].title ||
      "ChatGPT"
    );
  }

  const count =
    unreadTasks.length;

  const messages = {
    vi:
      `Bạn có ${count} task đã xong. Hãy click để xem.`,

    en:
      `You have ${count} completed tasks. Click to view.`,

    ja:
      `完了したタスクが${count}件あります。クリックして確認してください。`,

    ko:
      `완료된 작업이 ${count}개 있습니다. 클릭해서 확인하세요.`,

    zh:
      `你有 ${count} 个已完成的任务。点击查看。`
  };

  return (
    messages[language] ||
    messages.en
  );
}


async function emitAggregatedAlert() {
  await Promise.all([
    settingsReady,
    taskStateReady
  ]);

  if (tasks.size === 0) {
    await emitAggregatedNotification();
    return;
  }

  // Desktop notification uses the SAME aggregation window
  // as Sound / Voice.
  await emitAggregatedNotification();


  if (settings.alertMode === "voice") {
    await stopAlert();

    const alertLanguage =
      getAlertLanguage();

    await speakText(
      buildVoiceMessage(
        alertLanguage
      ),
      getSpeechLocale(
        alertLanguage
      ),
      settings.volume
    );

    return;
  }


  await stopAlert();

  await playSound(
    settings.soundLoop === true,
    settings.volume
  );
}

function scheduleCompletionAlert() {
  if (alertAggregationTimer) {
    clearTimeout(
      alertAggregationTimer
    );
  }

  alertAggregationTimer =
    setTimeout(() => {
      alertAggregationTimer = null;

      emitAggregatedAlert().catch(
        (error) => {
          console.error(
            "NUNU aggregated alert:",
            error
          );
        }
      );
    }, ALERT_AGGREGATION_MS);
}


async function markTaskDone(
  tabId,
  windowId,
  title = "ChatGPT",
  prompt = ""
) {
  await taskStateReady;
  const taskTitle =
    cleanTaskTitle(title);

  const taskPrompt =
    cleanPrompt(prompt);

  const taskLanguage =
    await detectTaskLanguage(
      tabId,
      taskPrompt
    );

  tasks.set(tabId, {
    tabId,
    windowId,
    title: taskTitle,
    prompt: taskPrompt,
    language: taskLanguage,
    status: "DONE_UNREAD",
    finishedAt: Date.now()
  });

  await sendTaskStatus(
    tabId,
    "DONE_UNREAD",
    taskTitle
  );

  await updateUnreadBadge();

  await persistTaskState();

  console.log(
    `NUNU: task ${tabId} DONE_UNREAD. Pending: ${tasks.size}`
  );

  scheduleCompletionAlert();
}


// Mark exactly one task as read.
async function markTaskRead(tabId) {
  await taskStateReady;

  if (!tasks.has(tabId)) {
    return;
  }

  const task = tasks.get(tabId);

  tasks.delete(tabId);

  await clearSummaryNotification();

  if (task?.notificationId) {
    await chrome.notifications.clear(
      task.notificationId
    ).catch(() => {});
  }

  await updateUnreadBadge();

  await persistTaskState();

  // Rebuild notification state for whatever unread
  // tasks remain after this one was read.
  await emitAggregatedNotification();

  await sendTaskStatus(
    tabId,
    "IDLE"
  );

  console.log(
    `NUNU: task ${tabId} READ. Pending: ${tasks.size}`
  );

  // Stop alerts only when ALL completed tasks have been read.
  if (tasks.size === 0) {
    if (alertAggregationTimer) {
      clearTimeout(
        alertAggregationTimer
      );

      alertAggregationTimer = null;
    }

    await stopAlert();
  }
}


// ChatGPT reports that a response has finished.
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "CHATGPT_RESPONSE_DONE") {
    return;
  }

  const senderTabId = sender.tab?.id;
  const senderWindowId = sender.tab?.windowId;

  if (senderTabId == null || senderWindowId == null) {
    return;
  }

  const completionFingerprint =
    String(
      message.completionFingerprint ||
      ""
    );

  (async () => {
    try {
      await Promise.all([
        taskStateReady,
        runningStateReady
      ]);

      if (
        completionFingerprint &&
        lastCompletionFingerprintByTab.get(
          senderTabId
        ) === completionFingerprint
      ) {
        console.log(
          `NUNU: duplicate completion ignored in tab ${senderTabId}`
        );

        return;
      }

      if (completionFingerprint) {
        lastCompletionFingerprintByTab.set(
          senderTabId,
          completionFingerprint
        );
      }

      // RUNNING -> completion processing.
      runningTasks.delete(
        senderTabId
      );

      await persistRunningState();

      // Let Chrome settle its focus state after response completion.
      await new Promise(resolve => setTimeout(resolve, 700));

      const [tab, windowInfo] = await Promise.all([
        chrome.tabs.get(senderTabId),
        chrome.windows.get(senderWindowId)
      ]);

      const userIsLookingAtThisTab =
        tab.active === true &&
        windowInfo.focused === true;

      // User is already looking at this result.
      // It must not become an unread task.
      if (userIsLookingAtThisTab) {
        if (tasks.has(senderTabId)) {
          await markTaskRead(senderTabId);
        } else {
          await sendTaskStatus(
            senderTabId,
            "IDLE"
          );
        }

        console.log(
          "NUNU: response completed in active tab - no alert"
        );

        return;
      }

      // Double-check immediately before creating the alert.
      const [tabAgain, windowAgain] = await Promise.all([
        chrome.tabs.get(senderTabId),
        chrome.windows.get(senderWindowId)
      ]);

      if (
        tabAgain.active === true &&
        windowAgain.focused === true
      ) {
        if (tasks.has(senderTabId)) {
          await markTaskRead(senderTabId);
        } else {
          await sendTaskStatus(
            senderTabId,
            "IDLE"
          );
        }

        console.log(
          "NUNU: tab became active before alert - cancelled"
        );

        return;
      }

      // This specific ChatGPT task genuinely finished in background.
      await markTaskDone(
        senderTabId,
        senderWindowId,
        message.sessionTitle,
        message.prompt
      );

    } catch (error) {
      console.error("NUNU completion state check:", error);
    }
  })();
});


// Second safety layer:
// ChatGPT itself reports when user returns to its page.
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "CHATGPT_PAGE_ACTIVE") {
    return;
  }

  const senderTabId = sender.tab?.id;
  const senderWindowId = sender.tab?.windowId;

  if (
    senderTabId == null ||
    senderWindowId == null ||
    !tasks.has(senderTabId)
  ) {
    return;
  }

  (async () => {
    try {
      const [tab, windowInfo] = await Promise.all([
        chrome.tabs.get(senderTabId),
        chrome.windows.get(senderWindowId)
      ]);

      if (
        tab.active === true &&
        windowInfo.focused === true
      ) {
        await markTaskRead(senderTabId);

        console.log(
          "NUNU: user returned to completed task"
        );
      }
    } catch (error) {
      console.error("NUNU page-active check:", error);
    }
  })();
});


// User activates a browser tab.
// Only count it as READ if its Chrome window is actually focused.
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (!tasks.has(activeInfo.tabId)) {
    return;
  }

  try {
    const windowInfo = await chrome.windows.get(
      activeInfo.windowId
    );

    if (windowInfo.focused === true) {
      await markTaskRead(activeInfo.tabId);
    }
  } catch (error) {
    console.error("NUNU tab activation check:", error);
  }
});


// Handle switching between separate Chrome windows.
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    return;
  }

  try {
    const tabs = await chrome.tabs.query({
      active: true,
      windowId: windowId
    });

    const activeTab = tabs[0];

    if (
      activeTab?.id != null &&
      tasks.has(activeTab.id)
    ) {
      await markTaskRead(activeTab.id);
    }
  } catch (error) {
    console.error("NUNU window focus check:", error);
  }
});


// If a completed ChatGPT tab is closed,
// remove that task from the unread set.
chrome.tabs.onRemoved.addListener((tabId) => {
  lastReliableLanguageByTab.delete(tabId);
  lastCompletionFingerprintByTab.delete(tabId);
  runningTasks.delete(tabId);

  persistRunningState()
    .catch(() => {});

  if (!tasks.has(tabId)) {
    persistTaskState().catch(() => {});
    return;
  }

  const task = tasks.get(tabId);

  tasks.delete(tabId);

  clearSummaryNotification()
    .catch(() => {});

  persistTaskState().catch(() => {});

  if (task?.notificationId) {
    chrome.notifications.clear(
      task.notificationId
    ).catch(() => {});
  }

  updateUnreadBadge();

  // Immediately reflect the new unread count:
  // summary -> smaller summary -> single task -> none.
  emitAggregatedNotification()
    .catch((error) => {
      console.error(
        "NUNU refresh notification after tab close:",
        error
      );
    });

  console.log(
    `NUNU: completed tab ${tabId} closed. Pending: ${tasks.size}`
  );

  if (tasks.size === 0) {
    if (alertAggregationTimer) {
      clearTimeout(
        alertAggregationTimer
      );

      alertAggregationTimer = null;
    }

    stopAlert();
  }
});


// ------------------------------------------------------------
// Popup Sound Preview API
// ------------------------------------------------------------

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (
      message?.type !==
      "NUNU_PREVIEW_SOUND"
    ) {
      return;
    }

    (async () => {
      try {
        await settingsReady;

        await stopAlert();

        await playSound(
          false,
          settings.volume,
          message.soundId ||
            settings.selectedSound
        );

        sendResponse({
          ok: true
        });
      } catch (error) {
        console.error(
          "NUNU preview sound:",
          error
        );

        sendResponse({
          ok: false,
          error: String(error)
        });
      }
    })();

    return true;
  }
);


// ------------------------------------------------------------
// Popup Test Alert API
// ------------------------------------------------------------

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (
      message?.type !==
      "NUNU_TEST_ALERT"
    ) {
      return;
    }

    (async () => {
      try {
        await settingsReady;

        await stopAlert();

        if (
          settings.alertMode ===
          "voice"
        ) {
          const language =
            getAlertLanguage();

          await speakText(
            buildVoiceTestMessage(
              language
            ),
            getSpeechLocale(
              language
            ),
            settings.volume
          );
        } else {
          await playSound(
            false,
            settings.volume
          );
        }

        sendResponse({
          ok: true
        });
      } catch (error) {
        console.error(
          "NUNU test alert:",
          error
        );

        sendResponse({
          ok: false,
          error: String(error)
        });
      }
    })();

    return true;
  }
);


// ------------------------------------------------------------
// Popup API
// ------------------------------------------------------------

function getPopupTaskSnapshot() {
  const running =
    Array.from(
      runningTasks.values()
    )
      .map((task) => ({
        tabId: task.tabId,
        windowId: task.windowId,
        title: task.title || "ChatGPT",
        prompt: task.prompt || "",
        language: task.language || "",
        status: "RUNNING",
        startedAt: task.startedAt || 0
      }))
      .sort(
        (a, b) =>
          b.startedAt - a.startedAt
      );

  const done =
    Array.from(tasks.values())
      .map((task) => ({
        tabId: task.tabId,
        windowId: task.windowId,
        title: task.title || "ChatGPT",
        prompt: task.prompt || "",
        language: task.language || "en",
        status: "DONE_UNREAD",
        finishedAt: task.finishedAt || 0
      }))
      .sort(
        (a, b) =>
          b.finishedAt - a.finishedAt
      );

  return [
    ...running,
    ...done
  ];
}


chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (
      message?.type ===
      "NUNU_GET_STATE"
    ) {
      (async () => {
        try {
          await Promise.all([
            settingsReady,
            taskStateReady,
            runningStateReady
          ]);

          sendResponse({
            ok: true,
            settings: {
              ...settings
            },
            tasks:
              getPopupTaskSnapshot()
          });
        } catch (error) {
          console.error(
            "NUNU popup GET_STATE:",
            error
          );

          sendResponse({
            ok: false,
            error: String(error)
          });
        }
      })();

      return true;
    }


    if (
      message?.type ===
      "NUNU_OPEN_TASK"
    ) {
      (async () => {
        const tabId =
          Number(message.tabId);

        if (
          !Number.isInteger(tabId)
        ) {
          sendResponse({
            ok: false,
            error: "Invalid tabId"
          });

          return;
        }

        try {
          const tab =
            await chrome.tabs.get(tabId);

          if (
            typeof tab.windowId ===
            "number"
          ) {
            await chrome.windows.update(
              tab.windowId,
              {
                focused: true
              }
            );
          }

          await chrome.tabs.update(
            tabId,
            {
              active: true
            }
          );

          if (tasks.has(tabId)) {
            await markTaskRead(tabId);
          }

          sendResponse({
            ok: true
          });
        } catch (error) {
          console.error(
            "NUNU popup OPEN_TASK:",
            error
          );

          sendResponse({
            ok: false,
            error: String(error)
          });
        }
      })();

      return true;
    }
  }
);


// Click a notification -> open exactly the ChatGPT tab
// that created that notification.
chrome.notifications.onClicked.addListener(
  async (notificationId) => {
    // Multiple completed tasks:
    // open the Task Inbox instead of guessing one tab.
    if (
      notificationId ===
      SUMMARY_NOTIFICATION_ID
    ) {
      await clearSummaryNotification();

      try {
        if (
          typeof chrome.action.openPopup ===
          "function"
        ) {
          await chrome.action.openPopup();
        } else {
          await chrome.tabs.create({
            url:
              chrome.runtime.getURL(
                "popup.html"
              )
          });
        }
      } catch (error) {
        console.error(
          "NUNU open Task Inbox:",
          error
        );

        // Fallback if opening the action popup
        // is unavailable in this browser context.
        try {
          await chrome.tabs.create({
            url:
              chrome.runtime.getURL(
                "popup.html"
              )
          });
        } catch {}
      }

      return;
    }


    const match =
      /^nunu-task:(\d+):/.exec(notificationId);

    if (!match) {
      return;
    }

    const tabId = Number(match[1]);

    try {
      const tab = await chrome.tabs.get(tabId);

      await chrome.tabs.update(tabId, {
        active: true
      });

      if (typeof tab.windowId === "number") {
        await chrome.windows.update(
          tab.windowId,
          {
            focused: true
          }
        );
      }

      if (tasks.has(tabId)) {
        await markTaskRead(tabId);
      }

      await chrome.notifications.clear(
        notificationId
      );
    } catch (error) {
      console.error(
        "NUNU notification click:",
        error
      );

      chrome.notifications.clear(
        notificationId
      ).catch(() => {});
    }
  }
);
