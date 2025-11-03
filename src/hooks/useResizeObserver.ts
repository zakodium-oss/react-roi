import { useCallback, useEffect, useRef, useState } from 'react';

type ResizeCallback = (rect: DOMRect) => void;

export function useResizeObserver(callback?: ResizeCallback) {
  const [size, setSize] = useState<DOMRect>();
  const observerRef = useRef<ResizeObserver | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const refCallback = useCallback((node: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      const updateSize = () => {
        const rect = node.getBoundingClientRect();
        callbackRef.current?.(rect);
        setSize(rect);
      };

      updateSize();

      const observer = new ResizeObserver(() => {
        updateSize();
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  return [refCallback, size] as const;
}
