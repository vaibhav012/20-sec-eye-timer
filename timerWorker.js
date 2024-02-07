let count = 0;
let timerDuration = 1000; // 1 second for demonstration, adjust as needed.

self.onmessage = function (e) {
  if (e.data === "start") {
    timerDuration = e.data.duration || 1000;
    count = 0;
    timer();
  } else if (e.data === "stop") {
    self.close(); // Terminates the worker.
  }
};

function timer() {
  setTimeout(() => {
    count += timerDuration;
    postMessage(count);
    timer();
  }, timerDuration);
}
