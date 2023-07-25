import { cloneElement, useContext, useEffect, useRef } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';

import { ResizeBox } from './ResizeBox';

interface ContainerProps {
  target: JSX.Element;
  children: JSX.Element[];
}

export function ContainerComponent({ target, children }: ContainerProps) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  const elementRef = useRef<HTMLElement | null>(null);
  const element = cloneElement(target, { ref: elementRef });
  const current = elementRef.current;
  const { width, height, top, left } = current
    ? current.getBoundingClientRect()
    : { width: 0, height: 0, top: 0, left: 0 };
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
        ratio: { x: 1, y: 1 },
      },
    });
  }, [width, height, top, left, roiDispatch]);
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
            width,
            height,
          }}
          viewBox={`0 0 ${width} ${height}`}
        >
          {[...children, resizeBox]}
        </svg>
      ) : null}
      {element}
    </div>
  );
}
