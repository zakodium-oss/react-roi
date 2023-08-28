export function throttle(func, timeFrame) {
  let lastTime = 0;
  return function throttled(...args) {
    const now = new Date().getTime();
    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
