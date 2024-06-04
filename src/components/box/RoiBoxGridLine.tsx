import { CSSProperties } from 'react';

import { GridLineData } from '../../utilities/grid';
import { defaultGridLineOpacity } from '../constants';

import { HandlerSizeOptions } from './sizes';

export interface RoiBoxGridLineProps {
  line: GridLineData;
  sizes: HandlerSizeOptions;
  handlerColor?: CSSProperties['color'];
  gridLineOpacity?: CSSProperties['opacity'];
}

export function RoiBoxGridLine(props: RoiBoxGridLineProps) {
  const {
    line,
    sizes,
    handlerColor,
    gridLineOpacity = defaultGridLineOpacity,
  } = props;
  return (
    <line
      {...line}
      stroke={handlerColor}
      strokeWidth={sizes.handlerBorderWidth}
      style={{ opacity: gridLineOpacity }}
    />
  );
}
