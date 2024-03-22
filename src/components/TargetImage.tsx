import { HTMLProps, MutableRefObject } from 'react';

import { useTargetRef } from '..';
import { getTargetImageStyle } from '../libHelpers/image';

interface TargetImageProps extends Omit<HTMLProps<HTMLImageElement>, 'src'> {
  src: string;
}

export function TargetImage(props: TargetImageProps) {
  const { style, ...otherProps } = props;
  const ref = useTargetRef() as MutableRefObject<HTMLImageElement>;

  return <img ref={ref} {...otherProps} style={getTargetImageStyle(style)} />;
}
