import { usePanZoom } from '../hooks/usePanZoom';
import { useRoiDispatch } from '../hooks/useRoiDispatch';
import { CornerData } from '../utilities/corners';

const cursorSize = 4;

export function RoiBoxCorner({
  corner,
  roiId,
}: {
  corner: CornerData;
  roiId: string;
}) {
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  const normalizedSize =
    cursorSize / (panZoom.panZoom.scale * panZoom.initialPanZoom.scale);

  return (
    <div
      id={`corner-${corner.xPosition}-${corner.yPosition}`}
      style={{
        backgroundColor: '#44aaff',
        opacity: 0.5,
        stroke: 'black',
        position: 'absolute',
        top: corner.cy - normalizedSize,
        left: corner.cx - normalizedSize,
        width: normalizedSize * 2,
        height: normalizedSize * 2,
        cursor: corner.cursor,
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
