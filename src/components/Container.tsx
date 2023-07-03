import { useContext } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';

export function Container({
  element,
  resizeBox,
  annotations,
  width,
  height,
}: {
  element: JSX.Element;
  resizeBox: JSX.Element;
  annotations: (JSX.Element | null)[];
  width: number;
  height: number;
}) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  return (
    <div
      className="custom-container"
      onMouseUp={(event) => roiDispatch({ type: 'onMouseUp', payload: event })}
      onMouseMove={(event) =>
        roiDispatch({ type: 'onMouseMove', payload: event })
      }
      onMouseDown={(event) =>
        roiDispatch({ type: 'onMouseDown', payload: event })
      }
    >
      {element}
      {annotations !== undefined ? (
        <svg
          style={{
            margin: '0px',
            padding: '0px',
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="svg"
          viewBox={`0 0 ${width} ${height}`}
        >
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
