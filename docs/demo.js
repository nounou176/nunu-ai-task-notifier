const startButton = document.querySelector("#startDemo");

const chatTab = document.querySelector("#chatTab");
const workTab = document.querySelector("#workTab");

const chatScreen = document.querySelector("#chatScreen");
const workScreen = document.querySelector("#workScreen");

const assistantBubble =
  document.querySelector("#assistantBubble");

const notification =
  document.querySelector("#notification");

const openTask =
  document.querySelector("#openTask");


let timers = [];


function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
}


function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}


function showChat() {
  chatTab.classList.add("active");
  workTab.classList.remove("active");

  chatScreen.classList.remove("hidden");
  workScreen.classList.add("hidden");
}


function showWork() {
  workTab.classList.add("active");
  chatTab.classList.remove("active");

  workScreen.classList.remove("hidden");
  chatScreen.classList.add("hidden");
}


function playSound(name) {
  const audio =
    new Audio(`./sounds/${name}.mp3`);

  audio.volume = 0.8;

  audio.play().catch(() => {
    // Browser may block audio in some situations.
  });
}


function resetDemo() {
  clearTimers();

  showChat();

  chatTab.textContent = "ChatGPT";

  assistantBubble.textContent =
    "Ready to start.";

  notification.classList.add("hidden");

  startButton.textContent =
    "▶ Try the 8-second demo";
}


function runDemo() {
  resetDemo();

  startButton.textContent =
    "↻ Restart demo";

  assistantBubble.textContent =
    "Thinking...";

  chatTab.textContent =
    "⏳ Quantum computing";

  later(() => {
    showWork();
  }, 1800);


  later(() => {
    chatTab.textContent =
      "✅ Quantum computing";

    notification.classList.remove("hidden");

    playSound("default-ding");
  }, 5200);
}


startButton.addEventListener(
  "click",
  runDemo
);


openTask.addEventListener(
  "click",
  () => {
    showChat();

    assistantBubble.textContent =
      "Quantum computing uses quantum physics to solve some problems in a new way.";

    notification.classList.add("hidden");

    chatTab.textContent =
      "ChatGPT";
  }
);


document
  .querySelectorAll("[data-sound]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {
        playSound(
          button.dataset.sound
        );
      }
    );

  });


// =========================================================
// INSTALL GUIDE
// =========================================================

const installSteps =
  [...document.querySelectorAll(".install-step")];

const progressItems =
  [...document.querySelectorAll(".progress-item")];

const installBack =
  document.querySelector("#installBack");

const installNext =
  document.querySelector("#installNext");

const installCounter =
  document.querySelector("#installCounter");

let installStepIndex = 0;


function renderInstallStep() {

  installSteps.forEach(
    (step, index) => {

      step.classList.toggle(
        "active",
        index === installStepIndex
      );

    }
  );


  progressItems.forEach(
    (item, index) => {

      item.classList.toggle(
        "active",
        index === installStepIndex
      );

      item.classList.toggle(
        "done",
        index < installStepIndex
      );

      const circle =
        item.querySelector("span");

      if (
        index < installStepIndex
      ) {
        circle.textContent =
          "✓";
      } else {
        circle.textContent =
          String(index + 1);
      }

    }
  );


  installBack.disabled =
    installStepIndex === 0;


  if (
    installStepIndex ===
    installSteps.length - 1
  ) {

    installNext.textContent =
      "🎉 Done";

    installNext.disabled =
      true;

  } else {

    installNext.textContent =
      "Next →";

    installNext.disabled =
      false;

  }


  installCounter.textContent =
    `${installStepIndex + 1} / ${installSteps.length}`;

}


installNext.addEventListener(
  "click",
  () => {

    if (
      installStepIndex <
      installSteps.length - 1
    ) {

      installStepIndex += 1;

      renderInstallStep();

    }

  }
);


installBack.addEventListener(
  "click",
  () => {

    if (
      installStepIndex > 0
    ) {

      installStepIndex -= 1;

      renderInstallStep();

    }

  }
);


const copyExtensionsUrl =
  document.querySelector(
    "#copyExtensionsUrl"
  );

const copyMessage =
  document.querySelector(
    "#copyMessage"
  );


copyExtensionsUrl.addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        "chrome://extensions"
      );

      copyExtensionsUrl.textContent =
        "✓ Copied";

      copyMessage.textContent =
        "Paste it into Chrome and press Enter.";

      setTimeout(
        () => {
          copyExtensionsUrl.textContent =
            "Copy";
        },
        1800
      );

    } catch {

      copyMessage.textContent =
        "Copy: chrome://extensions";

    }

  }
);


const installGuideLink =
  document.querySelector(".coming");

if (installGuideLink) {

  installGuideLink.style.cursor =
    "pointer";

  installGuideLink.addEventListener(
    "click",
    () => {

      document
        .querySelector("#install")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

}


renderInstallStep();
