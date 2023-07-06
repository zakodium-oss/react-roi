import { useContext, useEffect } from 'react';

import {
  RoiActions,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';

export function ContainerComponent({ element }: { element: JSX.Element }) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { roiState } = useContext(RoiContext);
  // @ts-expect-error i know
  const current = element.ref.current as HTMLElement;
  const { width, height, top, left } = current
    ? current.getBoundingClientRect()
    : { width: 0, height: 0, top: 0, left: 0 };
  useEffect(() => {
    roiDispatch({
      type: 'setComponentPosition',
      payload: {
        origin: { column: left, row: top },
        width,
        height,
      },
    });
  }, [width, height, top, left, roiDispatch]);
  const cursorSize = 3;
  const resizeBox = <ResizeBox key={`resize-box`} cursorSize={cursorSize} />;
  const annotations = roiState.rois.map((obj) => {
    if (
      obj.id === roiState.roiID &&
      (roiState.action === RoiActions.DRAG ||
        roiState.action === RoiActions.RESIZE)
    ) {
      return null;
    }
    return (
      <BoxAnnotation
        id={obj.id}
        key={obj.id}
        rectangle={getScaledRectangle(obj.rectangle, roiState.ratio)}
        options={obj.meta}
      />
    );
  });
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
      onMouseDown={(event) =>
        roiDispatch({ type: 'onMouseDown', payload: event })
      }
    >
      {element}
      {annotations !== undefined ? (
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
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
