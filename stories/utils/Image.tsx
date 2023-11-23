import { MutableRefObject } from 'react';

import { useTargetRef } from '../../src';

export function Image({
  src,
  style,
}: {
  src: string;
  style?: React.CSSProperties;
}) {
  const ref = useTargetRef() as MutableRefObject<HTMLImageElement>;

  return (
    <img
      alt="story"
      id="story-image"
      ref={ref}
      src={src}
      // Pointer events is disabled to prevent the image to be draggable
      // block display so that the container fits the dimensions of the image
      style={{
        display: 'block',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
}
