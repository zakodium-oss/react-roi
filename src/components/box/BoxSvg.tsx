import { CSSProperties } from 'react';

import {
  Box,
  GetStyleCallback,
  ReactRoiAction,
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
import { getHandlerSizes } from './sizes';

export interface BoxAnnotationProps {
  roi: Roi;
  box: Box;
  style?: CSSProperties;
  className?: string;
  isReadOnly: boolean;
  getStyle: GetStyleCallback;
}

export function BoxSvg({
  roi,
  style,
  className,
  isReadOnly,
  getStyle,
  box,
}: BoxAnnotationProps) {
  const isAltKeyDown = useIsKeyDown('Alt');
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  const roiState = useRoiState();

  const isSelected = roi.id === roiState.selectedRoi;
  const styles = getStyle(roi, {
    isReadOnly,
    isSelected,
    zoomScale: panZoom.panZoom.scale * panZoom.initialPanZoom.scale,
  });

  const handlerSizes = getHandlerSizes(roi);

  const clipPathId = `within-roi-${roi.id}`;
  const { lockPan } = useLockContext();

  return (
    <svg
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transform: `rotate(${box.angle}rad)`,
        display: 'block',
        overflow: 'visible',
        width: box.width,
        height: box.height,
        cursor: getCursor(
          roiState.mode,
          isReadOnly,
          isAltKeyDown,
          roiState.action,
          lockPan,
        ),
        ...style,
      }}
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
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
        <rect x={box.x} y={box.y} width={box.width} height={box.height} />
      </clipPath>
      <rect
        clipPath={`url(#${clipPathId})`}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        {...styles.rectAttributes}
      />
      {isSelected &&
        getAllCorners(box).map((corner) => (
          <RoiBoxCorner
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
            corner={corner}
            roiId={roi.id}
            sizes={handlerSizes}
            handlerColor={styles.resizeHandlerColor}
          />
        ))}
      {isSelected && (
        <circle
          id="rotate-handler"
          cx={box.x + box.width / 2}
          cy={box.y - handlerSizes.handlerSize * 2}
          fill="transparent"
          stroke={styles.resizeHandlerColor}
          cursor="grab"
          strokeWidth={handlerSizes.handlerSize / 6}
          r={handlerSizes.handlerSize / 3}
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
