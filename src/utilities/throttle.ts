// @ts-expect-error too generic to type
export function throttle(function_, timeFrame) {
  let lastTime = 0;
  // @ts-expect-error too generic to type
  return function throttled(...arguments_) {
    const now = Date.now();
    if (!(now - lastTime >= timeFrame)) {
      return;
    }

    function_(...arguments_);
    lastTime = now;
  };
}
