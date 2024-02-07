let timerId;
let phaseEndTime;
let isRelaxTime = false; // Tracks the current phase: relax or focus

const focusDurationMs = 0.25 * 60 * 1000; // 15 seconds for demonstration (originally 20 minutes)
const relaxDurationMs = 10 * 1000; // 10 seconds for relaxation

function clearExistingTimer() {
  if (timerId) clearInterval(timerId);
}

function startPhase(duration) {
  clearExistingTimer();
  const now = new Date();
  phaseEndTime = new Date(now.getTime() + duration);
  timerId = setInterval(updatePhaseTimer, 1000);
  updatePhaseTimer(); // Update immediately to avoid initial delay
}

function formatTime(remainingTime) {
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updatePhaseTimer() {
  const now = new Date();
  const remainingTime = phaseEndTime - now;
  const formattedTime = formatTime(remainingTime);

  if (isRelaxTime) {
    document.title = `Relax: ${formattedTime}`;
    document.getElementById(
      "timerDisplay"
    ).innerText = `Relax Time: ${formattedTime}`;
  } else {
    document.title = `Focus: ${formattedTime}`;
    document.getElementById(
      "timerDisplay"
    ).innerText = `Focus Time: ${formattedTime}`;
  }

  if (remainingTime < 0) {
    switchPhase();
  }
}

function switchPhase() {
  clearExistingTimer();
  if (!isRelaxTime) {
    // Show notification at the end of a focus phase
    showNotification();
  }
  isRelaxTime = !isRelaxTime; // Toggle phase
  startPhase(isRelaxTime ? relaxDurationMs : focusDurationMs);
}

function resetTimer() {
  clearExistingTimer();
  document.title = "Screen Time Reminder";
  document.getElementById("timerDisplay").innerText = "Focus Time: 20:00";
  isRelaxTime = false;
}

document.getElementById("startButton").addEventListener("click", () => {
  resetTimer(); // Resets the timer and state
  startPhase(focusDurationMs); // Starts with the focus phase
});

document.getElementById("resetButton").addEventListener("click", resetTimer);

function askNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("Focus Phase Completed", {
      body: "Time to relax! Take a short break.",
      icon: "path/to/icon.png", // Optional: add a small icon for the notification
    });
  }
}

document.getElementById("startButton").addEventListener("click", () => {
  askNotificationPermission(); // Ask for permission to show notifications
  resetTimer(); // Resets the timer and state
  startPhase(focusDurationMs); // Starts with the focus phase
});
