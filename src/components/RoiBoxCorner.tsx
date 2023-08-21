import { useRoiDispatch } from '../hooks/useRoiDispatch';
import { CornerData } from '../utilities/corners';

const cursorSize = 4;

export function RoiBoxCorner({
  pointer,
  roiId,
}: {
  pointer: CornerData;
  roiId: string;
}) {
  const roiDispatch = useRoiDispatch();

  return (
    <div
      id={`pointer-${pointer.xAxis}-${pointer.yAxis}`}
      style={{
        backgroundColor: '#44aaff',
        opacity: 0.5,
        stroke: 'black',
        position: 'absolute',
        top: pointer.cy - cursorSize,
        left: pointer.cx - cursorSize,
        width: cursorSize * 2,
        height: cursorSize * 2,
        cursor: pointer.cursor,
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        roiDispatch({
          type: 'START_RESIZE',
          payload: {
            id: roiId,
            xAxisCorner: pointer.xAxis,
            yAxisCorner: pointer.yAxis,
          },
        });
      }}
    />
  );
}
