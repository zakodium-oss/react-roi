import {
  MutableRefObject,
  cloneElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Modes,
  RoiStateContext,
  RoiDispatchContext,
} from '../context/RoiContext';

import { ResizeBox } from './ResizeBox';

interface ContainerProps {
  target: JSX.Element & { ref?: MutableRefObject<any> };
  children: JSX.Element;
  options?: { containerWidth?: number; containerHeight?: number };
}

export function ContainerComponent({
  target,
  children,
  options,
}: ContainerProps) {
  const roiDispatch = useContext(RoiDispatchContext);
  const roiState = useContext(RoiStateContext);
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
  const cursorSize = 3;
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
        cursor: roiState.mode === Modes.DRAW ? 'crosshair' : 'default',
      }}
    >
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
          // event.stopPropagation();
          if (event.buttons === 0) return;
          roiDispatch({ type: 'onMouseMove', payload: event });
        }}
        onMouseDown={(event) => {
          roiDispatch({ type: 'onMouseDown', payload: event });
        }}
      >
        {children}
        <ResizeBox key={`resize-box`} cursorSize={cursorSize} />
      </svg>
      {element}
    </div>
  );
}
