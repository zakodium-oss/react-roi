import { Box } from '../../types/utils';
import { CustomRoiStyle } from '../RoiList';

import { HandlerSizeOptions } from './sizes';

interface RoiBoxRotateHandlerProps {
  box: Box;
  handlerSizes: HandlerSizeOptions;
  styles: CustomRoiStyle;
}

export function RoiBoxRotateHandler(props: RoiBoxRotateHandlerProps) {
  const { box, handlerSizes, styles } = props;
  const cx = box.x + box.width / 2;
  const r = handlerSizes.handlerSize / 2.5;
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
        strokeWidth={2}
        r={r}
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
