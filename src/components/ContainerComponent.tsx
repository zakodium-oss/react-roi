import { useContext, useEffect } from 'react';

import {
  RoiActions,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';

import './css/ContainerComponent.css';

export function ContainerComponent({ element }: { element: JSX.Element }) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { roiState } = useContext(RoiContext);
  // @ts-expect-error i know
  const current = element.ref.current;
  const { width, height, top, left } = current
    ? current.getBoundingClientRect()
    : { width: 0, height: 0, top: 0, left: 0 };
  useEffect(() => {
    roiDispatch({
      type: 'setRoiState',
      payload: {
        offset: { top, left, right: 0, bottom: 0 },
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
          className="svg"
          style={{
            margin: '0px',
            padding: '0px',
            width: `${width}px`,
            height: `${height}px`,
          }}
          viewBox={`0 0 ${width ?? 0} ${height ?? 0}`}
        >
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
