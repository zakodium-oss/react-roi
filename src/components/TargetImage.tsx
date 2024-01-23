import { HTMLProps, MutableRefObject } from 'react';

import { useTargetRef } from '..';

interface TargetImageProps extends Omit<HTMLProps<HTMLImageElement>, 'src'> {
  src: string;
}

export function TargetImage(props: TargetImageProps) {
  const { style, ...otherProps } = props;
  const ref = useTargetRef() as MutableRefObject<HTMLImageElement>;

  return (
    <img
      ref={ref}
      {...otherProps}
      // Pointer events is disabled to prevent the image to be draggable
      // block display so that the container fits the dimensions of the image
      style={{
        display: 'block',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        // Revert any global css rules that can influence the width and height of the image
        // e.g. tailwindcss's preflight sets max-width: 100% on any img tag
        // The width and height of the target should be their natural values for react-roi to work as expected
        maxWidth: 'initial',
        maxHeight: 'initial',
        ...style,
      }}
    />
  );
}
