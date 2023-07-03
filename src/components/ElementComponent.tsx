import { cloneElement, useContext, useEffect, useRef } from 'react';

import {
  RoiActions,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { Container } from './Container';
import { ResizeBox } from './ResizeBox';

type ElementComponentProps = {
  children: JSX.Element;
};

export function ElementComponent({ children }: ElementComponentProps) {
  const { roiState } = useContext(RoiContext);
  const { roiDispatch } = useContext(RoiDispatchContext);
  const elementRef = useRef<HTMLElement | null>(null);
  const element = cloneElement(children, { ref: elementRef });
  const { width, height, top, left } = elementRef.current
    ? elementRef.current.getBoundingClientRect()
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

  const resizeBox = <ResizeBox key={`resize-box`} cursorSize={3} />;
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
    <Container
      element={element}
      resizeBox={resizeBox}
      annotations={annotations}
      width={width}
      height={height}
    />
  );
}
