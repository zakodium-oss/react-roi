import { useResizeObserver } from './useResizeObserver.ts';
import { useRoiDispatch } from './useRoiDispatch.js';

export function useTargetRef() {
  const roiDispatch = useRoiDispatch();

  const [targetRef] = useResizeObserver((rect) => {
    roiDispatch({
      type: 'SET_SIZE',
      payload: {
        width: rect.width,
        height: rect.height,
      },
    });
  });
  return targetRef;
}
