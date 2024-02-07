let count = 0;
let timerDuration = 1000; // 1 second for demonstration, adjust as needed.

self.onmessage = function (e) {
  if (e.data.action === "start" && e.data.duration) {
    timerDuration = e.data.duration;
    count = 0;
    timer();
  } else if (e.data === "stop") {
    self.close(); // Terminates the worker.
  }
};

function timer() {
  setTimeout(() => {
    count++;
    postMessage(count * 1000);
    if (count < timerDuration) timer();
  }, 1000);
}
