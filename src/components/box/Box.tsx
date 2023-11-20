import { CSSProperties } from 'react';

import { useRoiState } from '../../hooks';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { RoiMode } from '../../types';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';
import { RoiListProps } from '../api';

import { RoiBoxCorner } from './RoiBoxCorner';
import { getBaseSize } from './sizes';

export interface BoxAnnotationProps {
  roi: Roi;
  style?: CSSProperties;
  className?: string;
  // label?: ReactNode;
  isReadOnly: boolean;
  getStyle: RoiListProps['getStyle'];
}

export function Box({
  roi,
  style,
  className,
  isReadOnly,
  getStyle,
}: BoxAnnotationProps) {
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  const roiState = useRoiState();
  const sizes = getBaseSize(roi, panZoom.initialPanZoom.scale);

  const isSelected = roi.id === roiState.selectedRoi;

  return (
    <svg
      id={roi.id}
      style={{
        display: 'block',
        overflow: 'visible',
        width: roi.width,
        height: roi.height,
        cursor: getCursor(roiState.mode, isReadOnly),
        ...style,
      }}
      viewBox={`${roi.x} ${roi.y} ${roi.width} ${roi.height}`}
      className={className}
      onMouseDown={(event) => {
        if (event.altKey || isReadOnly) {
          return;
        }

        roiDispatch({
          type: 'SELECT_BOX_AND_START_MOVE',
          payload: {
            id: roi.id,
          },
        });
        if (roiState.mode === 'select') {
          // By preventing the event to fire on the container, we prevent
          // the drawing of a new ROI to start.
          event.stopPropagation();
        }
      }}
    >
      <rect
        x={roi.x}
        y={roi.y}
        width={roi.width}
        height={roi.height}
        {...getStyle(roi, {
          isReadOnly,
          isSelected,
          scale: panZoom.initialPanZoom.scale,
        })}
      />
      {isSelected &&
        getAllCorners(roi).map((corner) => (
          <RoiBoxCorner
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
            scale={panZoom.initialPanZoom.scale}
            corner={corner}
            roiId={roi.id}
            sizes={sizes}
          />
        ))}
    </svg>
  );
}

function getCursor(mode: RoiMode, readOnly: boolean): CSSProperties['cursor'] {
  if (readOnly) return 'default';
  return mode === 'draw' ? 'crosshair' : 'grab';
}
