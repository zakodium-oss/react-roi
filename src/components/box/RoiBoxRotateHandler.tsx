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
  const cy = box.y - handlerSizes.handlerSize * 1.2;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        fill="transparent"
        stroke={styles.resizeHandlerColor}
        cursor="grab"
        strokeWidth={handlerSizes.handlerSize / 6}
        r={handlerSizes.handlerSize / 3}
      />
      <rect
        id="rotate-handler"
        x={cx - handlerSizes.handlerSize}
        y={cy - handlerSizes.handlerSize}
        width={handlerSizes.handlerSize * 1.8}
        height={handlerSizes.handlerSize * 1.8}
        cursor="grab"
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
      />
    </>
  );
}
