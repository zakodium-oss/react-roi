import { CSSProperties } from 'react';

import { GetStyleCallback, ReactRoiAction, RoiMode, useRoiState } from '../..';
import { useIsKeyDown } from '../../hooks/useIsKeyDown';
import { useLockContext } from '../../hooks/useLockContext';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';

import { RoiBoxCorner } from './RoiBoxCorner';
import { getScaledSizes } from './sizes';
import { roiToFloorBox } from './util';

export interface BoxAnnotationProps {
  roi: Roi;
  style?: CSSProperties;
  className?: string;
  isReadOnly: boolean;
  getStyle: GetStyleCallback;
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
    zoomScale: panZoom.panZoom.scale * panZoom.initialPanZoom.scale,
  });

  const clipPathId = `within-roi-${roi.id}`;
  const { lockPan } = useLockContext();

  const flooredBox = roiToFloorBox(roi);

  return (
    <svg
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transform: `rotate(${roi.angle}rad)`,
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
      onPointerDown={(event) => {
        if (event.altKey || isReadOnly || roiState.mode === 'draw') {
          return;
        }

        const isRotate = (event.target as Element).id === 'rotate-handler';

        event.stopPropagation();

        if (isRotate) {
          roiDispatch({
            type: 'SELECT_BOX_AND_START_ROTATE',
            payload: {
              id: roi.id,
            },
          });
        } else {
          roiDispatch({
            type: 'SELECT_BOX_AND_START_MOVE',
            payload: {
              id: roi.id,
            },
          });
        }
      }}
    >
      {styles.renderCustomPattern?.()}

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
      {isSelected && (
        <circle
          id="rotate-handler"
          cx={flooredBox.x + flooredBox.width / 2}
          cy={flooredBox.y - scaledSizes.handlerSize * 2}
          fill="transparent"
          stroke={styles.resizeHandlerColor}
          cursor="grab"
          strokeWidth={scaledSizes.handlerSize / 6}
          r={scaledSizes.handlerSize / 3}
        />
      )}
    </svg>
  );
}

function getCursor(
  mode: RoiMode,
  readOnly: boolean,
  isAltKeyDown: boolean,
  action: ReactRoiAction,
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
    if (mode !== 'select') {
      if ((!isAltKeyDown && !lockPan) || lockPan) {
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
