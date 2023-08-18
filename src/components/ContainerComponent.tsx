import {
  MutableRefObject,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRoiState } from '../hooks';
import { useRoiDispatch } from '../hooks/useRoiDispatch';

interface ContainerProps {
  target: JSX.Element & { ref?: MutableRefObject<unknown> };
  children: JSX.Element;
  options?: { containerWidth?: number; containerHeight?: number };
}

export function ContainerComponent({
  target,
  children,
  options,
}: ContainerProps) {
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const { containerWidth, containerHeight } = options;
  const elementRef = useRef(null);
  const ref = target.ref ?? elementRef;
  const current = ref.current;
  const targetStyle = target.props.style;
  const element = cloneElement(target, {
    ref,
    style: {
      ...targetStyle,
      width: containerWidth,
      height: containerHeight,
    },
  });
  const [size, setSize] = useState({
    width: targetStyle?.width ?? 1,
    height: targetStyle?.height ?? 1,
  });

  if (current) {
    current.onload = () => {
      setSize({
        height: current.naturalHeight,
        width: current.naturalWidth,
      });
    };
  }
  useEffect(() => {
    roiDispatch({
      type: 'setRatio',
      payload: {
        x: size.width / containerWidth,
        y: size.height / containerHeight,
      },
    });
  }, [
    roiDispatch,
    current,
    containerWidth,
    containerHeight,
    size.width,
    size.height,
  ]);
  return (
    <div
      id="container-component"
      style={{
        display: 'flex',
        position: 'relative',
        margin: 0,
        padding: 0,
        width: 'fit-content',
        height: 'fit-content',
        cursor: roiState.mode === 'draw' ? 'crosshair' : 'default',
      }}
    >
      {element}
      <svg
        id="roi-container-svg"
        style={{
          position: 'absolute',
          margin: 0,
          padding: 0,
          width: containerWidth,
          height: containerHeight,
          userSelect: 'none',
        }}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        onMouseUp={(event) => {
          roiDispatch({ type: 'onMouseUp', payload: event });
        }}
        onMouseMove={(event) => {
          if (event.buttons === 0) return;
          roiDispatch({ type: 'onMouseMove', payload: event });
        }}
        onMouseDown={(event) => {
          roiDispatch({ type: 'onMouseDown', payload: event });
        }}
      >
        {children}
      </svg>
    </div>
  );
}
