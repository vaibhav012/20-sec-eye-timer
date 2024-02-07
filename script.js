let worker;
let isRelaxTime = false; // Tracks the current phase: relax or focus

const focusDurationMs = 20 * 60 * 1000; // 15 seconds for demonstration (originally 20 minutes)
const relaxDurationMs = 20 * 1000; // 10 seconds for relaxation

function startWorkerWithPhase(duration) {
  if (worker) {
    worker.terminate(); // Stop any existing worker
  }
  worker = new Worker("timerWorker.js");
  worker.postMessage({ action: "start", duration: duration }); // Start the worker with the specified duration

  worker.onmessage = function (e) {
    const timeElapsed = e.data;
    updatePhaseTimer(duration - timeElapsed, duration);
  };
}

function updatePhaseTimer(remainingTime, totalDuration) {
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

  if (remainingTime <= 0) {
    switchPhase(totalDuration);
  }
}

function formatTime(remainingTime) {
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function switchPhase(previousDuration) {
  if (!isRelaxTime && previousDuration === focusDurationMs) {
    // Show notification at the end of a focus phase
    showNotification();
  }
  isRelaxTime = !isRelaxTime; // Toggle phase
  const nextDuration = isRelaxTime ? relaxDurationMs : focusDurationMs;
  startWorkerWithPhase(nextDuration);
}

function resetTimer() {
  if (worker) {
    worker.terminate();
  }
  document.title = "Screen Time Reminder";
  document.getElementById("timerDisplay").innerText = "Focus Time: 20:00";
  isRelaxTime = false;
}

document.getElementById("startButton").addEventListener("click", () => {
  askNotificationPermission(); // Ask for permission to show notifications
  resetTimer(); // Resets the timer and state
  startWorkerWithPhase(focusDurationMs); // Starts with the focus phase
});

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
      // Make sure the path to the icon is correct or remove it if not needed
      icon: "path/to/icon.png",
    });
  } else {
    console.log("Notification permission denied");
  }
}
