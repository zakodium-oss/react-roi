import { CSSProperties } from 'react';

import {
  CommittedBox,
  RoiAction,
  RoiListProps,
  RoiMode,
  useRoiState,
} from '../..';
import { useIsKeyDown } from '../../hooks/useIsKeyDown';
import { useLockContext } from '../../hooks/useLockContext';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';

import { RoiBoxCorner } from './RoiBoxCorner';
import { getScaledSizes } from './sizes';

export interface BoxAnnotationProps {
  roi: Roi;
  style?: CSSProperties;
  className?: string;
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
  const isAltKeyDown = useIsKeyDown('Alt');
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  const roiState = useRoiState();
  const scaledSizes = getScaledSizes(roi, panZoom);

  const isSelected = roi.id === roiState.selectedRoi;
  const styles = getStyle(roi, {
    isReadOnly,
    isSelected,
    scaledSizes,
  });

  const clipPathId = `within-roi-${roi.id}`;
  const { lockPan } = useLockContext();

  const flooredBox = floorRoi(roi);

  return (
    <svg
      style={{
        display: 'block',
        overflow: 'visible',
        width: flooredBox.width,
        height: flooredBox.height,
        cursor: getCursor(
          roiState.mode,
          isReadOnly,
          isAltKeyDown,
          roiState.action,
          lockPan,
        ),
        ...style,
      }}
      viewBox={`${flooredBox.x} ${flooredBox.y} ${flooredBox.width} ${flooredBox.height}`}
      className={className}
      onMouseDown={(event) => {
        if (event.altKey || isReadOnly || roiState.mode === 'draw') {
          return;
        }

        event.stopPropagation();

        roiDispatch({
          type: 'SELECT_BOX_AND_START_MOVE',
          payload: {
            id: roi.id,
          },
        });
      }}
    >
      <clipPath id={clipPathId}>
        <rect
          x={flooredBox.x}
          y={flooredBox.y}
          width={flooredBox.width}
          height={flooredBox.height}
        />
      </clipPath>
      <rect
        clipPath={`url(#${clipPathId})`}
        x={flooredBox.x}
        y={flooredBox.y}
        width={flooredBox.width}
        height={flooredBox.height}
        {...styles.rectAttributes}
      />
      {isSelected &&
        getAllCorners(flooredBox).map((corner) => (
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

function getCursor(
  mode: RoiMode,
  readOnly: boolean,
  isAltKeyDown: boolean,
  action: RoiAction,
  lockPan: boolean,
): CSSProperties['cursor'] {
  if (action !== 'idle') {
    if (action === 'drawing') {
      return 'crosshair';
    } else if (action === 'moving') {
      return 'move';
    } else if (action === 'panning') {
      return 'grab';
    }
  }

  if (isAltKeyDown && !lockPan) return 'grab';

  if (readOnly) {
    if (mode === 'draw') {
      if (!isAltKeyDown && !lockPan) {
        return 'crosshair';
      } else {
        return isAltKeyDown ? 'grab' : 'default';
      }
    } else {
      return lockPan ? 'default' : 'grab';
    }
  }

  return mode === 'draw' ? 'crosshair' : 'move';
}

function floorRoi(roi: Roi): CommittedBox {
  const x1 = Math.floor(roi.x1);
  const y1 = Math.floor(roi.y1);
  const x2 = Math.floor(roi.x2);
  const y2 = Math.floor(roi.y2);
  return {
    x: x1,
    width: x2 - x1,
    y: y1,
    height: y2 - y1,
  };
}
