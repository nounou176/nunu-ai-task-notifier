const DEFAULT_SOUND_URL =
  chrome.runtime.getURL(
    "sounds/default-ding.mp3"
  );

const audio =
  new Audio(
    DEFAULT_SOUND_URL
  );

audio.preload = "auto";

let currentAudioSource =
  DEFAULT_SOUND_URL;

let currentUtterance = null;

// Every STOP or newer speech request invalidates
// any older request that may still be waiting for voices.
let speechRequestGeneration = 0;


function clampVolume(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 1;
  }

  return Math.min(
    1,
    Math.max(0, number)
  );
}


function setAudioSource(source) {
  const nextSource =
    String(source || "").trim() ||
    DEFAULT_SOUND_URL;

  if (
    nextSource ===
    currentAudioSource
  ) {
    return;
  }

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {}

  currentAudioSource =
    nextSource;

  audio.src =
    nextSource;

  audio.preload =
    "auto";

  try {
    audio.load();
  } catch {}
}


function stopAudio() {
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  } catch (error) {
    console.error(
      "Cannot stop NUNU sound:",
      error
    );
  }
}


function stopSpeech() {
  // Invalidate requests waiting for speechSynthesis voices.
  speechRequestGeneration += 1;

  try {
    speechSynthesis.cancel();
    currentUtterance = null;
  } catch (error) {
    console.error(
      "Cannot stop NUNU speech:",
      error
    );
  }
}


function findBestVoice(language) {
  try {
    const voices =
      speechSynthesis.getVoices();

    if (!voices.length) {
      return null;
    }

    const requested =
      String(language || "")
        .toLowerCase();

    if (!requested) {
      return null;
    }

    const exact = voices.find(
      voice =>
        voice.lang.toLowerCase() ===
        requested
    );

    if (exact) {
      return exact;
    }

    const base =
      requested.split("-")[0];

    const sameLanguageLocal =
      voices.find(
        voice =>
          voice.localService === true &&
          voice.lang
            .toLowerCase()
            .startsWith(base)
      );

    if (sameLanguageLocal) {
      return sameLanguageLocal;
    }

    return (
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(base)
      ) || null
    );
  } catch {
    return null;
  }
}


function waitForMatchingVoice(
  language,
  generation,
  timeoutMs = 2000
) {
  const immediate =
    findBestVoice(language);

  if (immediate) {
    return Promise.resolve(immediate);
  }

  return new Promise((resolve) => {
    let finished = false;

    let intervalId = null;
    let timeoutId = null;


    const finish = (voice) => {
      if (finished) {
        return;
      }

      finished = true;

      if (intervalId) {
        clearInterval(intervalId);
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      try {
        speechSynthesis.removeEventListener(
          "voiceschanged",
          check
        );
      } catch {}

      resolve(voice || null);
    };


    const check = () => {
      // Task was read/stopped or a newer speech request arrived.
      if (
        generation !==
        speechRequestGeneration
      ) {
        finish(null);
        return;
      }

      const voice =
        findBestVoice(language);

      if (voice) {
        finish(voice);
      }
    };


    try {
      speechSynthesis.addEventListener(
        "voiceschanged",
        check
      );
    } catch {}


    // Some Chromium/Linux builds do not reliably emit
    // voiceschanged, so poll as a second safety mechanism.
    intervalId =
      setInterval(check, 100);


    timeoutId =
      setTimeout(() => {
        finish(
          findBestVoice(language)
        );
      }, timeoutMs);


    check();
  });
}


function playSpeechFallbackSound(volume) {
  console.warn(
    "NUNU: matching TTS voice unavailable; falling back to sound"
  );

  try {
    setAudioSource(
      DEFAULT_SOUND_URL
    );

    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
    audio.volume =
      clampVolume(volume);

    audio.play().catch(
      (error) => {
        console.error(
          "NUNU TTS fallback sound:",
          error
        );
      }
    );
  } catch (error) {
    console.error(
      "NUNU TTS fallback sound:",
      error
    );
  }
}


async function speakText(
  text,
  language,
  volume = 1
) {
  const content =
    String(text || "").trim();

  if (!content) {
    return;
  }

  stopAudio();

  // Cancels any older speech request first.
  stopSpeech();

  const generation =
    speechRequestGeneration;

  try {
    let voice =
      findBestVoice(language);

    // Chromium may create the offscreen document before
    // speechSynthesis has populated its voice list.
    if (!voice) {
      voice =
        await waitForMatchingVoice(
          language,
          generation,
          2000
        );
    }

    // STOP / READ / newer speech happened while waiting.
    if (
      generation !==
      speechRequestGeneration
    ) {
      return;
    }

    // The browser genuinely has no suitable voice.
    if (!voice) {
      playSpeechFallbackSound(
        volume
      );

      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        content
      );

    utterance.volume =
      clampVolume(volume);

    if (language) {
      utterance.lang = language;
    }

    utterance.voice = voice;

    utterance.onend = () => {
      if (
        currentUtterance ===
        utterance
      ) {
        currentUtterance = null;
      }
    };

    utterance.onerror = (event) => {
      console.error(
        "NUNU speech error:",
        event.error
      );

      if (
        currentUtterance ===
        utterance
      ) {
        currentUtterance = null;
      }
    };

    currentUtterance =
      utterance;

    speechSynthesis.speak(
      utterance
    );
  } catch (error) {
    console.error(
      "Cannot speak NUNU text:",
      error
    );
  }
}

chrome.runtime.onMessage.addListener(
  (message) => {
    if (
      message?.type ===
      "PLAY_NUNU_SOUND"
    ) {
      stopSpeech();

      try {
        setAudioSource(
          message.source
        );

        audio.pause();
        audio.currentTime = 0;

        audio.loop =
          message.loop === true;

        audio.volume =
          clampVolume(
            message.volume
          );

        audio.play().catch(
          (error) => {
            console.error(
              "Cannot play NUNU sound:",
              error
            );
          }
        );
      } catch (error) {
        console.error(
          "NUNU audio error:",
          error
        );
      }

      return;
    }


    if (
      message?.type ===
      "STOP_NUNU_SOUND"
    ) {
      stopAudio();
      return;
    }


    if (
      message?.type ===
      "SPEAK_NUNU_TEXT"
    ) {
      speakText(
        message.text,
        message.language,
        message.volume
      ).catch((error) => {
        console.error(
          "NUNU async speech:",
          error
        );
      });

      return;
    }


    if (
      message?.type ===
      "STOP_NUNU_SPEECH"
    ) {
      stopSpeech();
      return;
    }


    if (
      message?.type ===
      "STOP_NUNU_ALERT"
    ) {
      stopAudio();
      stopSpeech();
    }
  }
);
