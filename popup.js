(() => {
  console.log("[NUNU Popup] loaded");

  const DEFAULT_SETTINGS = {
    alertMode: "sound",
    language: "auto",
    soundLoop: true,
    volume: 1,
    selectedSound: "default-ding"
  };

  const CUSTOM_SOUND_STORAGE_KEY =
    "nunuCustomSoundV1";

  const MAX_CUSTOM_SOUND_BYTES =
    1024 * 1024;

  const MAX_CUSTOM_SOUND_SECONDS =
    10;

  const LANGUAGE_LABELS = {
    en: "EN",
    vi: "VI",
    ja: "JA",
    ko: "KO",
    zh: "ZH"
  };


  const elements = {
    alertMode:
      document.getElementById(
        "alertMode"
      ),

    soundSettings:
      document.getElementById(
        "soundSettings"
      ),

    voiceSettings:
      document.getElementById(
        "voiceSettings"
      ),

    soundLoopRow:
      document.getElementById(
        "soundLoopRow"
      ),

    soundSelect:
      document.getElementById(
        "soundSelect"
      ),

    customSoundOption:
      document.getElementById(
        "customSoundOption"
      ),

    previewSound:
      document.getElementById(
        "previewSound"
      ),

    uploadSound:
      document.getElementById(
        "uploadSound"
      ),

    customSoundFile:
      document.getElementById(
        "customSoundFile"
      ),

    customSoundRow:
      document.getElementById(
        "customSoundRow"
      ),

    customSoundName:
      document.getElementById(
        "customSoundName"
      ),

    removeCustomSound:
      document.getElementById(
        "removeCustomSound"
      ),

    soundHelp:
      document.querySelector(
        ".sound-help"
      ),

    language:
      document.getElementById(
        "language"
      ),

    volume:
      document.getElementById(
        "volume"
      ),

    volumeValue:
      document.getElementById(
        "volumeValue"
      ),

    soundLoop:
      document.getElementById(
        "soundLoop"
      ),

    testAlert:
      document.getElementById(
        "testAlert"
      ),

    unreadBadge:
      document.getElementById(
        "unreadBadge"
      ),

    runningCount:
      document.getElementById(
        "runningCount"
      ),

    runningList:
      document.getElementById(
        "runningList"
      ),

    taskCount:
      document.getElementById(
        "taskCount"
      ),

    taskList:
      document.getElementById(
        "taskList"
      )
  };


  let currentSettings = {
    ...DEFAULT_SETTINGS
  };

  let currentCustomSound = null;


  function clampVolume(value) {
    const number =
      Number(value);

    if (!Number.isFinite(number)) {
      return 1;
    }

    return Math.min(
      1,
      Math.max(0, number)
    );
  }


  async function saveSettings(
    partial
  ) {
    currentSettings = {
      ...currentSettings,
      ...partial
    };

    try {
      await chrome.storage.local.set(
        partial
      );
    } catch (error) {
      console.error(
        "NUNU popup settings save:",
        error
      );
    }
  }


  function renderAlertMode() {
    const buttons =
      elements.alertMode
        .querySelectorAll(
          "[data-mode]"
        );

    for (const button of buttons) {
      const active =
        button.dataset.mode ===
        currentSettings.alertMode;

      button.classList.toggle(
        "active",
        active
      );
    }

    const soundMode =
      currentSettings.alertMode ===
      "sound";

    // Show only controls relevant to the
    // currently selected alert mode.
    elements.soundSettings
      .classList.toggle(
        "hidden",
        !soundMode
      );

    elements.voiceSettings
      .classList.toggle(
        "hidden",
        soundMode
      );

    elements.soundLoopRow
      .classList.toggle(
        "hidden",
        !soundMode
      );


    // Hidden controls are disabled as well.
    elements.soundLoop.disabled =
      !soundMode;

    elements.soundSelect.disabled =
      !soundMode;

    elements.previewSound.disabled =
      !soundMode;

    elements.uploadSound.disabled =
      !soundMode;

    elements.removeCustomSound.disabled =
      !soundMode;

    elements.language.disabled =
      soundMode;
  }


  function renderSettings() {
    renderAlertMode();

    const hasCustomSound =
      Boolean(
        currentCustomSound?.dataUrl
      );

    elements.customSoundOption.hidden =
      !hasCustomSound;

    elements.customSoundRow
      .classList.toggle(
        "hidden",
        !hasCustomSound
      );

    if (hasCustomSound) {
      elements.customSoundName.textContent =
        currentCustomSound.name ||
        "Custom sound";
    }

    const requestedSound =
      currentSettings.selectedSound ||
      "default-ding";

    const availableOption =
      Array.from(
        elements.soundSelect.options
      ).some(
        option =>
          option.value === requestedSound &&
          !option.hidden
      );

    elements.soundSelect.value =
      availableOption
        ? requestedSound
        : "default-ding";

    elements.language.value =
      currentSettings.language ||
      "auto";

    const volume =
      clampVolume(
        currentSettings.volume
      );

    elements.volume.value =
      String(volume);

    elements.volumeValue.textContent =
      `${Math.round(volume * 100)}%`;

    elements.soundLoop.checked =
      currentSettings.soundLoop ===
      true;
  }


  function escapeText(text) {
    return String(text || "");
  }


  function formatLanguage(language) {
    return (
      LANGUAGE_LABELS[language] ||
      String(language || "")
        .toUpperCase() ||
      "?"
    );
  }


  function createTaskCard(task) {
    const card =
      document.createElement("article");

    card.className =
      "task-card";


    const title =
      document.createElement("div");

    title.className =
      "task-title";

    title.textContent =
      `✅ ${escapeText(
        task.title || "ChatGPT"
      )}`;


    const prompt =
      document.createElement("div");

    prompt.className =
      "task-prompt";

    prompt.textContent =
      escapeText(
        task.prompt ||
        "Task completed."
      );


    const footer =
      document.createElement("div");

    footer.className =
      "task-footer";


    const language =
      document.createElement("span");

    language.className =
      "task-language";

    language.textContent =
      formatLanguage(
        task.language
      );


    const openButton =
      document.createElement("button");

    openButton.type =
      "button";

    openButton.className =
      "open-task";

    openButton.textContent =
      "Open";


    openButton.addEventListener(
      "click",
      async () => {
        openButton.disabled = true;
        openButton.textContent =
          "Opening...";

        try {
          const response =
            await chrome.runtime.sendMessage({
              type: "NUNU_OPEN_TASK",
              tabId: task.tabId
            });

          if (!response?.ok) {
            throw new Error(
              response?.error ||
              "Could not open task"
            );
          }

          window.close();
        } catch (error) {
          console.error(
            "NUNU popup open task:",
            error
          );

          openButton.disabled =
            false;

          openButton.textContent =
            "Open";
        }
      }
    );


    footer.append(
      language,
      openButton
    );

    card.append(
      title,
      prompt,
      footer
    );

    return card;
  }


  function createRunningCard(task) {
    const card =
      document.createElement("article");

    card.className =
      "task-card";


    const title =
      document.createElement("div");

    title.className =
      "task-title";

    title.textContent =
      `⏳ ${escapeText(
        task.title || "ChatGPT"
      )}`;


    const footer =
      document.createElement("div");

    footer.className =
      "task-footer";


    const status =
      document.createElement("span");

    status.className =
      "task-language";

    status.textContent =
      "RUNNING";


    const openButton =
      document.createElement("button");

    openButton.type = "button";
    openButton.className = "open-task";
    openButton.textContent = "Open";

    openButton.addEventListener(
      "click",
      async () => {
        openButton.disabled = true;

        try {
          const response =
            await chrome.runtime.sendMessage({
              type: "NUNU_OPEN_TASK",
              tabId: task.tabId
            });

          if (!response?.ok) {
            throw new Error(
              response?.error ||
              "Could not open task"
            );
          }

          window.close();
        } catch (error) {
          console.error(
            "NUNU popup open running task:",
            error
          );

          openButton.disabled = false;
        }
      }
    );

    footer.append(
      status,
      openButton
    );

    card.append(
      title,
      footer
    );

    return card;
  }


  function renderTasks(tasks) {
    const safeTasks =
      Array.isArray(tasks)
        ? tasks
        : [];

    const runningTasks =
      safeTasks.filter(
        task =>
          task.status === "RUNNING"
      );

    const unreadTasks =
      safeTasks.filter(
        task =>
          task.status ===
          "DONE_UNREAD"
      );


    // RUNNING
    elements.runningCount.textContent =
      String(runningTasks.length);

    elements.runningList.replaceChildren();

    if (runningTasks.length === 0) {
      const empty =
        document.createElement("div");

      empty.className =
        "empty-state";

      empty.textContent =
        "No running tasks.";

      elements.runningList.append(
        empty
      );
    } else {
      for (const task of runningTasks) {
        elements.runningList.append(
          createRunningCard(task)
        );
      }
    }


    // DONE / UNREAD
    elements.taskCount.textContent =
      String(unreadTasks.length);

    elements.unreadBadge.textContent =
      String(unreadTasks.length);

    elements.unreadBadge.classList.toggle(
      "hidden",
      unreadTasks.length === 0
    );

    elements.taskList.replaceChildren();

    if (unreadTasks.length === 0) {
      const empty =
        document.createElement("div");

      empty.className =
        "empty-state";

      empty.textContent =
        "No completed tasks.";

      elements.taskList.append(
        empty
      );

      return;
    }

    for (const task of unreadTasks) {
      elements.taskList.append(
        createTaskCard(task)
      );
    }
  }


  function setSoundHelp(text) {
    if (!elements.soundHelp) {
      return;
    }

    elements.soundHelp.textContent =
      String(text || "");
  }


  function isSupportedAudioFile(file) {
    if (!file) {
      return false;
    }

    if (
      String(file.type || "")
        .toLowerCase()
        .startsWith("audio/")
    ) {
      return true;
    }

    return /\.(mp3|wav|ogg|webm)$/i.test(
      file.name || ""
    );
  }


  function readFileAsDataUrl(file) {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onload = () => {
          resolve(
            String(reader.result || "")
          );
        };

        reader.onerror = () => {
          reject(
            new Error(
              "Could not read audio file"
            )
          );
        };

        reader.readAsDataURL(file);
      }
    );
  }


  function readAudioDuration(file) {
    return new Promise(
      (resolve, reject) => {
        const url =
          URL.createObjectURL(file);

        const testAudio =
          new Audio();

        const cleanup = () => {
          URL.revokeObjectURL(url);
        };

        testAudio.preload =
          "metadata";

        testAudio.onloadedmetadata =
          () => {
            const duration =
              Number(
                testAudio.duration
              );

            cleanup();

            if (
              !Number.isFinite(duration)
            ) {
              reject(
                new Error(
                  "Could not determine sound duration"
                )
              );

              return;
            }

            resolve(duration);
          };

        testAudio.onerror = () => {
          cleanup();

          reject(
            new Error(
              "Unsupported or invalid audio file"
            )
          );
        };

        testAudio.src = url;
      }
    );
  }


  async function loadState() {
    try {
      const response =
        await chrome.runtime.sendMessage({
          type: "NUNU_GET_STATE"
        });

      if (!response?.ok) {
        throw new Error(
          response?.error ||
          "Could not load state"
        );
      }

      currentSettings = {
        ...DEFAULT_SETTINGS,
        ...(response.settings || {})
      };

      const customStored =
        await chrome.storage.local.get(
          CUSTOM_SOUND_STORAGE_KEY
        );

      currentCustomSound =
        customStored[
          CUSTOM_SOUND_STORAGE_KEY
        ] || null;

      if (
        currentSettings.selectedSound ===
          "custom" &&
        !currentCustomSound?.dataUrl
      ) {
        await saveSettings({
          selectedSound:
            "default-ding"
        });
      }

      renderSettings();
      renderTasks(
        response.tasks
      );
    } catch (error) {
      console.error(
        "NUNU popup state load:",
        error
      );

      currentSettings = {
        ...DEFAULT_SETTINGS
      };

      currentCustomSound = null;

      renderSettings();
      renderTasks([]);
    }
  }


  elements.alertMode.addEventListener(
    "click",
    async (event) => {
      const button =
        event.target.closest(
          "[data-mode]"
        );

      if (!button) {
        return;
      }

      const mode =
        button.dataset.mode;

      if (
        mode !== "sound" &&
        mode !== "voice"
      ) {
        return;
      }

      await saveSettings({
        alertMode: mode
      });

      renderAlertMode();
    }
  );


  elements.soundSelect.addEventListener(
    "change",
    async () => {
      await saveSettings({
        selectedSound:
          elements.soundSelect.value
      });
    }
  );


  elements.previewSound.addEventListener(
    "click",
    async () => {
      elements.previewSound.disabled =
        true;

      const oldText =
        elements.previewSound.textContent;

      elements.previewSound.textContent =
        "Playing...";

      try {
        const response =
          await chrome.runtime.sendMessage({
            type:
              "NUNU_PREVIEW_SOUND",
            soundId:
              elements.soundSelect.value
          });

        if (!response?.ok) {
          throw new Error(
            response?.error ||
            "Preview failed"
          );
        }
      } catch (error) {
        console.error(
          "NUNU sound preview:",
          error
        );

        setSoundHelp(
          "Preview failed"
        );
      } finally {
        setTimeout(() => {
          elements.previewSound.disabled =
            currentSettings.alertMode !==
            "sound";

          elements.previewSound.textContent =
            oldText;
        }, 500);
      }
    }
  );


  elements.uploadSound.addEventListener(
    "click",
    () => {
      elements.customSoundFile.click();
    }
  );


  elements.customSoundFile.addEventListener(
    "change",
    async () => {
      const file =
        elements.customSoundFile
          .files?.[0];

      elements.customSoundFile.value =
        "";

      if (!file) {
        return;
      }

      try {
        if (
          !isSupportedAudioFile(file)
        ) {
          throw new Error(
            "Please choose an audio file"
          );
        }

        if (
          file.size >
          MAX_CUSTOM_SOUND_BYTES
        ) {
          throw new Error(
            "Sound must be 1 MB or smaller"
          );
        }

        setSoundHelp(
          "Checking custom sound..."
        );

        const duration =
          await readAudioDuration(file);

        if (
          duration >
          MAX_CUSTOM_SOUND_SECONDS
        ) {
          throw new Error(
            "Sound must be 10 seconds or shorter"
          );
        }

        const dataUrl =
          await readFileAsDataUrl(file);

        if (
          !dataUrl.startsWith("data:")
        ) {
          throw new Error(
            "Could not encode sound"
          );
        }

        currentCustomSound = {
          name:
            String(
              file.name ||
              "Custom sound"
            ),
          type:
            String(
              file.type ||
              "audio/mpeg"
            ),
          duration,
          dataUrl
        };

        await chrome.storage.local.set({
          [CUSTOM_SOUND_STORAGE_KEY]:
            currentCustomSound
        });

        await saveSettings({
          selectedSound: "custom"
        });

        renderSettings();

        setSoundHelp(
          `Custom: ${
            currentCustomSound.name
          }`
        );
      } catch (error) {
        console.error(
          "NUNU custom sound:",
          error
        );

        setSoundHelp(
          error?.message ||
          "Could not upload sound"
        );
      }
    }
  );


  elements.removeCustomSound
    .addEventListener(
      "click",
      async () => {
        try {
          await chrome.storage.local.remove(
            CUSTOM_SOUND_STORAGE_KEY
          );

          currentCustomSound = null;

          await saveSettings({
            selectedSound:
              "default-ding"
          });

          renderSettings();

          setSoundHelp(
            "Custom audio up to 1 MB"
          );
        } catch (error) {
          console.error(
            "NUNU remove custom sound:",
            error
          );
        }
      }
    );


  elements.language.addEventListener(
    "change",
    async () => {
      await saveSettings({
        language:
          elements.language.value
      });
    }
  );


  elements.volume.addEventListener(
    "input",
    () => {
      const volume =
        clampVolume(
          elements.volume.value
        );

      elements.volumeValue.textContent =
        `${Math.round(
          volume * 100
        )}%`;
    }
  );


  elements.volume.addEventListener(
    "change",
    async () => {
      await saveSettings({
        volume:
          clampVolume(
            elements.volume.value
          )
      });
    }
  );


  elements.soundLoop.addEventListener(
    "change",
    async () => {
      await saveSettings({
        soundLoop:
          elements.soundLoop.checked
      });
    }
  );


  elements.testAlert.addEventListener(
    "click",
    async () => {
      elements.testAlert.disabled = true;

      const originalText =
        elements.testAlert.textContent;

      elements.testAlert.textContent =
        "Testing...";

      try {
        const response =
          await chrome.runtime.sendMessage({
            type: "NUNU_TEST_ALERT"
          });

        if (!response?.ok) {
          throw new Error(
            response?.error ||
            "Test alert failed"
          );
        }
      } catch (error) {
        console.error(
          "NUNU popup test alert:",
          error
        );
      } finally {
        setTimeout(() => {
          elements.testAlert.disabled =
            false;

          elements.testAlert.textContent =
            originalText;
        }, 600);
      }
    }
  );


  chrome.storage.onChanged.addListener(
    (changes, areaName) => {
      if (areaName !== "local") {
        return;
      }

      let changed = false;

      for (
        const key of Object.keys(
          DEFAULT_SETTINGS
        )
      ) {
        if (!changes[key]) {
          continue;
        }

        currentSettings[key] =
          changes[key].newValue ??
          DEFAULT_SETTINGS[key];

        changed = true;
      }

      if (
        changes[
          CUSTOM_SOUND_STORAGE_KEY
        ]
      ) {
        currentCustomSound =
          changes[
            CUSTOM_SOUND_STORAGE_KEY
          ].newValue ||
          null;

        changed = true;
      }

      if (changed) {
        renderSettings();
      }
    }
  );


  loadState();
})();
