import type { CSSProperties } from 'react';

import type { GridLineData } from '../../utilities/grid.js';
import { defaultGridLineOpacity } from '../constants.js';

import type { HandlerSizeOptions } from './sizes.js';

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
