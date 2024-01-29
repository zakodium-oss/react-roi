// @ts-expect-error too generic to type
export function throttle(func, timeFrame) {
  let lastTime = 0;
  // @ts-expect-error too generic to type
  return function throttled(...args) {
    const now = new Date().getTime();
    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
