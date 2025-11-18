import type { CustomRoiStyle } from '../../types/RoiList.ts';
import type { Box } from '../../utilities/box.js';

import { baseHandlerSizes } from './sizes.js';

interface RoiBoxRotateHandlerProps {
  box: Box;
  styles: CustomRoiStyle;
}

export function RoiBoxRotateHandler(props: RoiBoxRotateHandlerProps) {
  const { box, styles } = props;
  const cx = box.x + box.width / 2;
  const r = baseHandlerSizes.handlerSize / 2.5;

  const offset = r * 3;
  const cy = box.y - offset;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        fill="transparent"
        stroke={styles.resizeHandlerColor}
        cursor="grab"
        strokeWidth={baseHandlerSizes.handlerBorderWidth}
        r={r}
      />
      <line
        x1={box.x + box.width / 2}
        y1={box.y}
        x2={box.x + box.width / 2}
        y2={box.y - offset + r}
        strokeWidth={baseHandlerSizes.handlerBorderWidth}
        stroke={styles.resizeHandlerColor}
      />
      <rect
        id="rotate-handler"
        x={cx - 2 * r}
        y={cy - 2 * r}
        width={r * 4}
        height={r * 4}
        cursor="grab"
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
      />
    </>
  );
}
