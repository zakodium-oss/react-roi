import { cloneElement, useContext, useEffect, useRef } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';

import { ResizeBox } from './ResizeBox';

interface ContainerProps {
  target: JSX.Element;
  children: JSX.Element[];
  options?: { containerWidth?: number; containerHeight?: number };
}

export function ContainerComponent({
  target,
  children,
  options,
}: ContainerProps) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { containerWidth, containerHeight } = options;
  const elementRef = useRef<HTMLElement | null>(null);
  const current = elementRef.current;
  const { width = 1, height = 1 } = target.props.style;
  const { top, left } = current
    ? current.getBoundingClientRect()
    : { top: 0, left: 0 };
  const element = cloneElement(target, {
    ref: elementRef,
    style: {
      ...target.props.style,
      width: containerWidth,
      height: containerHeight,
    },
  });

  useEffect(() => {
    roiDispatch({
      type: 'setComponentPosition',
      payload: {
        position: {
          x: left,
          y: top,
          width,
          height,
        },
        ratio: {
          x: width / containerWidth,
          y: height / containerHeight,
        },
      },
    });
  }, [
    roiDispatch,
    current,
    left,
    top,
    width,
    height,
    containerWidth,
    containerHeight,
  ]);
  const cursorSize = 3;
  const resizeBox = <ResizeBox key={`resize-box`} cursorSize={cursorSize} />;
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
      }}
      onMouseUp={(event) => roiDispatch({ type: 'onMouseUp', payload: event })}
      onMouseMove={(event) =>
        roiDispatch({ type: 'onMouseMove', payload: event })
      }
      onMouseDown={(event) => {
        roiDispatch({ type: 'onMouseDown', payload: event });
      }}
    >
      {children !== undefined ? (
        <svg
          style={{
            position: 'absolute',
            margin: 0,
            padding: 0,
            width: containerWidth,
            height: containerHeight,
          }}
          viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        >
          {[...children, resizeBox]}
        </svg>
      ) : null}
      {element}
    </div>
  );
}
