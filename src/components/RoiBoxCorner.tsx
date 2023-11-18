import { usePanZoom } from '../hooks/usePanZoom';
import { useRoiDispatch } from '../hooks/useRoiDispatch';
import { CornerData } from '../utilities/corners';

import { cornerColor, cursorSize } from './constants';

export function RoiBoxCorner({
  corner,
  roiId,
}: {
  corner: CornerData;
  roiId: string;
}) {
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  const normalizedSize = Math.round(
    Math.max(
      cursorSize / (panZoom.panZoom.scale * panZoom.initialPanZoom.scale),
      2,
    ),
  );

  return (
    <div
      id={`corner-${corner.xPosition}-${corner.yPosition}`}
      style={{
        borderStyle: 'solid',
        borderWidth: (1 / panZoom.panZoom.scale) * panZoom.initialPanZoom.scale,
        borderColor: cornerColor,
        position: 'absolute',
        top: corner.cy - normalizedSize,
        left: corner.cx - normalizedSize,
        width: normalizedSize * 2,
        height: normalizedSize * 2,
        cursor: corner.cursor,
        borderRadius: '25%',
        boxSizing: 'border-box',
      }}
      onMouseDown={(event) => {
        if (event.altKey) {
          return;
        }
        event.stopPropagation();
        roiDispatch({
          type: 'START_RESIZE',
          payload: {
            id: roiId,
            xAxisCorner: corner.xPosition,
            yAxisCorner: corner.yPosition,
          },
        });
      }}
    />
  );
}
