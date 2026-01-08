import type { HTMLProps } from 'react';

import { useTargetRef } from '../index.js';
import { getTargetImageStyle } from '../libHelpers/image.js';

interface TargetImageProps extends Omit<HTMLProps<HTMLImageElement>, 'src'> {
  src: string;
}

export function TargetImage(props: TargetImageProps) {
  const { style, ...otherProps } = props;
  const ref = useTargetRef<HTMLImageElement>();

  return <img ref={ref} {...otherProps} style={getTargetImageStyle(style)} />;
}
