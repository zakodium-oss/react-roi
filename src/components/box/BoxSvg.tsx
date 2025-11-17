import type { CSSProperties } from 'react';

import { useIsKeyDown } from '../../hooks/useIsKeyDown.js';
import { useLockContext } from '../../hooks/useLockContext.js';
import { usePanZoom } from '../../hooks/usePanZoom.js';
import { useRoiDispatch } from '../../hooks/useRoiDispatch.js';
import type {
  GetStyleCallback,
  ReactRoiAction,
  RoiMode,
  RoiState,
} from '../../index.js';
import { useRoiState } from '../../index.js';
import type { Roi } from '../../types/Roi.js';
import type { Box } from '../../utilities/box.js';
import { getAllCorners } from '../../utilities/corners.js';
import type { GetGridLinesOptions } from '../../utilities/grid.js';
import { getAllEdges, getAllGridLines } from '../../utilities/grid.js';

import { RoiBoxCorner } from './RoiBoxCorner.js';
import { RoiBoxEdge } from './RoiBoxEdge.js';
import { RoiBoxGridLine } from './RoiBoxGridLine.js';
import { RoiBoxRotateHandler } from './RoiBoxRotateHandler.js';
import { getHandlerSizes } from './sizes.js';
import { baseRoiStyle } from './styles.js';

export interface BoxAnnotationProps {
  roi: Roi;
  box: Box;
  style?: CSSProperties;
  className?: string;
  isReadOnly: boolean;
  getStyle: GetStyleCallback;
  displayRotationHandle: boolean;
  showGrid: boolean;
  gridOptions: GetGridLinesOptions;
}

export function BoxSvg({
  roi,
  style,
  className,
  isReadOnly,
  getStyle,
  box,
  displayRotationHandle,
  showGrid,
  gridOptions,
}: BoxAnnotationProps) {
  const isAltKeyDown = useIsKeyDown('Alt');
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  const roiState = useRoiState();

  const isSelected = roi.id === roiState.selectedRoi;
  const styles = {
    ...baseRoiStyle,
    ...getStyle(roi, {
      isReadOnly,
      isSelected,
      zoomScale: panZoom.panZoom.scale * panZoom.initialPanZoom.scale,
    }),
  };

  const handlerSizes = getHandlerSizes(roi, panZoom);

  const clipPathId = `within-roi-${roi.id}`;
  const { lockPan } = useLockContext();

  return (
    <svg
      style={{
        display: 'block',
        overflow: 'visible',
        width: box.width,
        height: box.height,
        cursor: getCursor(
          roiState,
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
        if (
          event.altKey ||
          isReadOnly ||
          roiState.mode === 'draw' ||
          event.button !== 0
        ) {
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
            type: 'SELECT_BOX_AND_START_ACTION',
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
        showGrid &&
        getAllGridLines(box, gridOptions).map((gridLine, idx) => (
          <RoiBoxGridLine
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            line={gridLine}
            sizes={handlerSizes}
            gridLineOpacity={styles.gridLineOpacity}
            handlerColor={styles.resizeHandlerColor}
          />
        ))}
      {isSelected &&
        showGrid &&
        getAllEdges(box, roi.box.angle).map((edge) => (
          <RoiBoxEdge
            key={`border-${edge.position}`}
            roiId={roi.id}
            sizes={handlerSizes}
            handlerColor={styles.resizeHandlerColor}
            edge={edge}
            disabled={isResizableMode(roiState.mode)}
            gridLineOpacity={styles.gridLineOpacity}
          />
        ))}

      {isSelected &&
        getAllCorners(box, roi.box.angle).map((corner) => (
          <RoiBoxCorner
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
            disabled={!isResizableMode(roiState.mode)}
            corner={corner}
            roiId={roi.id}
            sizes={handlerSizes}
            handlerColor={styles.resizeHandlerColor}
          />
        ))}

      {isSelected &&
        displayRotationHandle &&
        (roi.action.type === 'rotating' || roi.action.type === 'idle') && (
          <RoiBoxRotateHandler box={box} styles={styles} />
        )}
    </svg>
  );
}

function getCursor(
  state: RoiState,
  readOnly: boolean,
  isAltKeyDown: boolean,
  action: ReactRoiAction,
  lockPan: boolean,
): CSSProperties['cursor'] {
  const { mode, selectedRoi } = state;
  if (mode === 'rotate_selected' && selectedRoi) {
    return 'ew-resize';
  }
  if (action !== 'idle') {
    if (action === 'drawing') {
      return 'crosshair';
    } else if (action === 'moving') {
      return 'move';
    } else if (action === 'rotating') {
      return 'ew-resize';
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

  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (mode) {
    case 'draw':
      return 'crosshair';
    default:
      return 'move';
  }
}

function isResizableMode(mode: RoiMode) {
  return mode === 'select' || mode === 'hybrid';
}
