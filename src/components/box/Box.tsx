import { CSSProperties } from 'react';

import { useRoiState } from '../../hooks';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { RoiMode } from '../../types';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';
import { RoiListProps } from '../api';

import { RoiBoxCorner } from './RoiBoxCorner';
import { getScaledSizes } from './sizes';

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
  const scaledSizes = getScaledSizes(roi, panZoom.initialPanZoom.scale);

  const isSelected = roi.id === roiState.selectedRoi;
  const styles = getStyle(roi, {
    isReadOnly,
    isSelected,
    scaledSizes,
  });

  const clipPathId = `within-roi-${roi.id}`;

  return (
    <svg
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
      <clipPath id={clipPathId}>
        <rect x={roi.x} y={roi.y} width={roi.width} height={roi.height} />
      </clipPath>
      <rect
        clipPath={`url(#${clipPathId})`}
        x={roi.x}
        y={roi.y}
        width={roi.width}
        height={roi.height}
        {...styles.rectAttributes}
      />
      {isSelected &&
        getAllCorners(roi).map((corner) => (
          <RoiBoxCorner
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
            corner={corner}
            roiId={roi.id}
            sizes={scaledSizes}
            handlerColor={styles.resizeHandlerColor}
          />
        ))}
    </svg>
  );
}

function getCursor(mode: RoiMode, readOnly: boolean): CSSProperties['cursor'] {
  if (readOnly) return 'default';
  return mode === 'draw' ? 'crosshair' : 'grab';
}
