import { memo } from 'react';

import { useRoiState } from '../../hooks';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';
import { Box } from '../Box';

interface RoiBoxProps {
  roi: Roi;
}

function RoiBoxInternal({ roi }: RoiBoxProps): JSX.Element {
  const roiState = useRoiState();
  const roiDispatch = useRoiDispatch();
  const { style, selectedStyle: editStyle, x, y, width, height } = roi;
  const isActive = roi.id === roiState.selectedRoi;
  const cursorSize = 4;
  return (
    <>
      <Box
        id={roi.id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isActive ? editStyle : style}
        label={roi.label}
      />
      {roiState.mode === 'select' &&
        isActive &&
        getAllCorners(roi).map((pointer) => (
          <div
            id={`pointer-${pointer.xAxis}-${pointer.yAxis}`}
            key={`pointer-${pointer.xAxis}-${pointer.yAxis}`}
            style={{
              backgroundColor: '#44aaff',
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
                  id: roi.id,
                  xAxisCorner: pointer.xAxis,
                  yAxisCorner: pointer.yAxis,
                },
              });
            }}
          />
        ))}
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
