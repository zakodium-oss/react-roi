import { Image, writeCanvas } from 'image-js';
import { useContext, useEffect, useRef } from 'react';

import {
  RoiActions,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { Container } from './Container';
import { ResizeBox } from './ResizeBox';

export type RoiComponentOptions = {
  width?: number;
  height?: number;
  cursorSize?: number;
};

export function ImageComponent({
  image,
  options = {},
}: {
  image: Image;
  options?: RoiComponentOptions;
}) {
  const {
    width = image.width,
    height = image.height,
    cursorSize = 3,
  } = options;
  const { roiState } = useContext(RoiContext);
  const { roiDispatch } = useContext(RoiDispatchContext);
  const imageRef = useRef<HTMLCanvasElement>(null);
  const { top, left } = imageRef.current
    ? imageRef.current.getBoundingClientRect()
    : { top: 0, left: 0 };
  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
    roiDispatch({
      type: 'setRoiState',
      payload: {
        ratio: {
          x: image.width / width,
          y: image.height / height,
        },
        offset: {
          top,
          left,
          right: 0,
          bottom: 0,
        },
        width,
        height,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top, left, width, height, image]);
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
    <Container
      element={
        <canvas
          ref={imageRef}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      }
      resizeBox={resizeBox}
      annotations={annotations}
      width={width}
      height={height}
    />
  );
}
