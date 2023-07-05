import { Image, writeCanvas } from 'image-js';
import { useContext, useEffect, useRef } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';

import { ContainerComponent } from './ContainerComponent';

export type RoiComponentOptions = {
  width?: number;
  height?: number;
  cursorSize?: number;
};

export function ImageWrapper({
  image,
  options = {},
}: {
  image: Image;
  options?: RoiComponentOptions;
}) {
  const { width = image.width, height = image.height } = options;
  const { roiDispatch } = useContext(RoiDispatchContext);
  const imageRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
    roiDispatch({
      type: 'setRatio',
      payload: { x: image.width / width, y: image.height / height },
    });
  }, [width, height, image, roiDispatch]);
  const canvas = (
    <canvas
      id="roi-image"
      ref={imageRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
  return <ContainerComponent element={canvas} />;
}
