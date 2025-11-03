import useResizeObserver from '@react-hook/resize-observer';
import { useRef } from 'react';

import { useRoiDispatch } from './useRoiDispatch.js';

export function useTargetRef<T extends HTMLElement>() {
  const targetRef = useRef<T>(null);
  const roiDispatch = useRoiDispatch();

  // @ts-expect-error types are wrongly exported by library
  useResizeObserver(targetRef, (data) => {
    roiDispatch({
      type: 'SET_SIZE',
      payload: {
        width: data.contentRect.width,
        height: data.contentRect.height,
      },
    });
  });
  return targetRef;
}
