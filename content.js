(() => {
  const INSTANCE_ATTRIBUTE =
    "data-nunu-ai-task-notifier-owner";

  const instanceToken = [
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2)
  ].join("-");


  function claimInstance() {
    try {
      document.documentElement?.setAttribute(
        INSTANCE_ATTRIBUTE,
        instanceToken
      );
    } catch {}
  }


  function ownsInstance() {
    try {
      return (
        document.documentElement?.getAttribute(
          INSTANCE_ATTRIBUTE
        ) === instanceToken
      );
    } catch {
      return false;
    }
  }


  claimInstance();

  console.log(
    "[NUNU AI Task Notifier] loaded",
    instanceToken
  );

  const FINAL_ANSWER_WAIT_MS = 30000;
  const CHECK_INTERVAL_MS = 200;

  let lastSentFingerprint = "";


  function normalize(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }


  function pageIsActive() {
    try {
      return (
        document.visibilityState === "visible" &&
        document.hasFocus()
      );
    } catch {
      return document.visibilityState === "visible";
    }
  }


  function getConversationTurns() {
    try {
      return Array.from(
        document.querySelectorAll(
          '[data-testid^="conversation-turn-"]'
        )
      );
    } catch {
      return [];
    }
  }


  function getRole(turn) {
    if (!turn) {
      return "";
    }

    try {
      const directRole = normalize(
        turn.getAttribute("data-message-author-role") ||
        turn.getAttribute("data-turn") ||
        ""
      ).toLowerCase();

      if (
        directRole === "user" ||
        directRole === "assistant"
      ) {
        return directRole;
      }

      if (
        turn.querySelector(
          '[data-message-author-role="user"]'
        )
      ) {
        return "user";
      }

      if (
        turn.querySelector(
          '[data-message-author-role="assistant"]'
        )
      ) {
        return "assistant";
      }
    } catch {}

    return "";
  }


  function getUserText(turn) {
    if (!turn) {
      return "";
    }

    try {
      const node =
        turn.matches?.(
          '[data-message-author-role="user"]'
        )
          ? turn
          : turn.querySelector(
              '[data-message-author-role="user"]'
            );

      if (!node) {
        return "";
      }

      return normalize(
        node.innerText ||
        node.textContent ||
        ""
      );
    } catch {
      return "";
    }
  }


  function getAssistantText(turn) {
    if (!turn) {
      return "";
    }

    try {
      const node =
        turn.matches?.(
          '[data-message-author-role="assistant"]'
        )
          ? turn
          : turn.querySelector(
              '[data-message-author-role="assistant"]'
            );

      if (!node) {
        return "";
      }

      const rendered =
        node.querySelector(".markdown") ||
        node.querySelector('[class*="prose"]') ||
        node;

      return normalize(
        rendered.innerText ||
        rendered.textContent ||
        ""
      );
    } catch {
      return "";
    }
  }


  function latestPromptSnapshot() {
    const turns = getConversationTurns();

    let latestUserIndex = -1;

    for (let i = 0; i < turns.length; i += 1) {
      if (getRole(turns[i]) === "user") {
        latestUserIndex = i;
      }
    }

    if (latestUserIndex < 0) {
      return null;
    }

    const userTurn = turns[latestUserIndex];
    const promptText = getUserText(userTurn);

    let assistantTurn = null;
    let assistantText = "";

    for (
      let i = latestUserIndex + 1;
      i < turns.length;
      i += 1
    ) {
      if (getRole(turns[i]) !== "assistant") {
        continue;
      }

      const text = getAssistantText(turns[i]);

      if (!text) {
        continue;
      }

      assistantTurn = turns[i];
      assistantText = text;
    }

    const promptKey = [
      location.pathname,
      userTurn?.getAttribute("data-testid") ||
      `user-${latestUserIndex}`
    ].join("|");

    const assistantKey =
      assistantTurn?.getAttribute("data-testid") ||
      "";

    return {
      promptKey,
      promptText,
      assistantKey,
      assistantText
    };
  }


  function sendResponseDone(snapshot) {
    if (!ownsInstance()) {
      return;
    }

    if (!snapshot?.assistantText) {
      return;
    }

    const fingerprint = [
      snapshot.promptKey,
      snapshot.assistantKey,
      snapshot.assistantText.slice(0, 1000)
    ].join("|");

    if (fingerprint === lastSentFingerprint) {
      return;
    }

    lastSentFingerprint = fingerprint;

    try {
      if (!chrome.runtime?.id) {
        return;
      }

      chrome.runtime.sendMessage({
        type: "CHATGPT_RESPONSE_DONE",
        sessionTitle: document.title,
        prompt: snapshot.promptText,
        response: snapshot.assistantText,
        completionFingerprint: fingerprint,
        pageWasActive: pageIsActive()
      }).catch(() => {
        // Ignore stale extension context.
      });
    } catch {
      // Ignore stale extension context.
    }
  }


  function waitForFinalAnswer() {
    const startedAt = Date.now();

    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (!ownsInstance()) {
          clearInterval(timer);
          resolve(null);
          return;
        }

        const snapshot = latestPromptSnapshot();

        if (snapshot?.assistantText) {
          clearInterval(timer);
          resolve(snapshot);
          return;
        }

        if (
          Date.now() - startedAt >
          FINAL_ANSWER_WAIT_MS
        ) {
          clearInterval(timer);
          resolve(null);
        }
      }, CHECK_INTERVAL_MS);
    });
  }


  chrome.runtime.onMessage.addListener((message) => {
    if (!ownsInstance()) {
      return;
    }

    if (
      message?.type !==
      "CHATGPT_CONVERSATION_REQUEST_COMPLETED"
    ) {
      return;
    }

    waitForFinalAnswer().then((snapshot) => {
      if (!snapshot) {
        console.log(
          "NUNU: network completed but no final answer found"
        );
        return;
      }

      sendResponseDone(snapshot);
    });
  });


  // ------------------------------------------------------------
  // Browser-tab task status
  // IDLE        -> Conversation title
  // RUNNING     -> ⏳ Conversation title
  // DONE_UNREAD -> ✅ Conversation title
  // ------------------------------------------------------------

  const STATUS_PREFIX_RE = /^(?:⏳|✅)\s*/;

  let taskVisualStatus = "IDLE";
  let conversationTitle = String(document.title || "ChatGPT")
    .replace(STATUS_PREFIX_RE, "")
    .trim() || "ChatGPT";


  function cleanConversationTitle(rawTitle) {
    return String(rawTitle || "ChatGPT")
      .replace(STATUS_PREFIX_RE, "")
      .trim() || "ChatGPT";
  }


  function renderTaskTitle() {
    if (!ownsInstance()) {
      return;
    }

    const prefix =
      taskVisualStatus === "RUNNING"
        ? "⏳ "
        : taskVisualStatus === "DONE_UNREAD"
          ? "✅ "
          : "";

    const desiredTitle =
      `${prefix}${conversationTitle}`;

    if (document.title === desiredTitle) {
      return;
    }

    document.title = desiredTitle;
  }


  function reassertTaskTitleSoon() {
    // ChatGPT can rewrite <title> in the same mutation cycle
    // in which NUNU changes it. Re-assert a few times after
    // the state transition so a synchronous overwrite cannot
    // permanently remove the ⏳ / ✅ prefix.
    for (const delay of [0, 50, 250, 1000]) {
      setTimeout(() => {
        if (!ownsInstance()) {
          return;
        }

        renderTaskTitle();
      }, delay);
    }
  }


  function setTaskVisualStatus(status, title = "") {
    if (title) {
      conversationTitle =
        cleanConversationTitle(title);
    } else {
      const current =
        cleanConversationTitle(document.title);

      if (current) {
        conversationTitle = current;
      }
    }

    taskVisualStatus = status;

    renderTaskTitle();
    reassertTaskTitleSoon();
  }


  // ChatGPT may rename the conversation after the first response.
  // Preserve that new title while keeping our ⏳ / ✅ prefix.
  const titleElement =
    document.querySelector("title");

  if (titleElement) {
    const titleObserver = new MutationObserver(() => {
      if (!ownsInstance()) {
        return;
      }

      const prefix =
        taskVisualStatus === "RUNNING"
          ? "⏳ "
          : taskVisualStatus === "DONE_UNREAD"
            ? "✅ "
            : "";

      const desiredTitle =
        `${prefix}${conversationTitle}`;

      // Mutation caused by NUNU itself:
      // title is already correct, so do nothing.
      if (document.title === desiredTitle) {
        return;
      }

      // ChatGPT changed the underlying conversation title.
      // Preserve its newest title, then restore NUNU status.
      const newTitle =
        cleanConversationTitle(document.title);

      if (newTitle) {
        conversationTitle = newTitle;
      }

      renderTaskTitle();
    });

    titleObserver.observe(titleElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }


  chrome.runtime.onMessage.addListener((message) => {
    if (!ownsInstance()) {
      return;
    }

    if (message?.type !== "NUNU_TASK_STATUS") {
      return;
    }

    if (
      message.status !== "IDLE" &&
      message.status !== "RUNNING" &&
      message.status !== "DONE_UNREAD"
    ) {
      return;
    }

    setTaskVisualStatus(
      message.status,
      message.title || ""
    );
  });


  function reportPageActive() {
    if (!ownsInstance()) {
      return;
    }

    try {
      if (!chrome.runtime?.id) {
        return;
      }

      chrome.runtime.sendMessage({
        type: "CHATGPT_PAGE_ACTIVE"
      }).catch(() => {});
    } catch {}
  }


  window.addEventListener(
    "focus",
    reportPageActive,
    true
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.visibilityState === "visible"
      ) {
        reportPageActive();
      }
    },
    true
  );

  document.addEventListener(
    "pointerdown",
    reportPageActive,
    {
      capture: true,
      passive: true
    }
  );
})();
