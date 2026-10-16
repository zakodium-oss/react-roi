import type { CSSProperties } from 'react';

import { useContainerInteractions } from '../../hooks/useContainerInteractions.js';
import { useIsKeyDown } from '../../hooks/useIsKeyDown.js';
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
import type { ResolvedRoiInteractions } from '../../types/interactions.js';
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
  interactions: ResolvedRoiInteractions;
  getStyle: GetStyleCallback;
  showRotationHandle: boolean;
  showGrid: boolean;
  gridOptions: GetGridLinesOptions;
}

export function BoxSvg({
  roi,
  style,
  className,
  interactions,
  getStyle,
  box,
  showRotationHandle,
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
    ...getStyle(
      {
        interactions,
        isSelected,
        id: roi.id,
        box: roi.box,
        label: roi.label,
        data: roi.data,
        action: roi.action.type,
      },
      {
        zoomScale: panZoom.panZoom.scale * panZoom.basePanZoom.scale,
      },
    ),
  };

  const handlerSizes = getHandlerSizes(roi, panZoom);

  const clipPathId = `within-roi-${roi.id}`;
  const { pan: canPan } = useContainerInteractions();
  const isResizeDisabled =
    !isResizableMode(roiState.mode) || !interactions.resize;

  return (
    <svg
      style={{
        display: 'block',
        overflow: 'visible',
        width: box.width,
        height: box.height,
        cursor: getCursor(
          roiState,
          interactions,
          isAltKeyDown,
          roiState.action,
          canPan,
        ),
        ...style,
      }}
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      className={className}
      onPointerDown={(event) => {
        if (
          event.altKey ||
          !interactions.select ||
          roiState.mode === 'draw' ||
          event.button !== 0
        ) {
          return;
        }

        const isRotate = (event.target as Element).id === 'rotate-handler';

        event.stopPropagation();

        if (roiState.mode === 'rotate_selected') {
          roiDispatch({
            type: 'SELECT_BOX_AND_START_ACTION',
            payload: { id: roi.id },
          });
          return;
        }

        if (isRotate && interactions.rotate) {
          roiDispatch({
            type: 'SELECT_BOX_AND_START_ROTATE',
            payload: { id: roi.id },
          });
        } else if (!isRotate && interactions.move) {
          roiDispatch({
            type: 'SELECT_BOX_AND_START_ACTION',
            payload: { id: roi.id },
          });
        } else {
          // Selecting is allowed but the drag is not: select without starting an action.
          roiDispatch({ type: 'SELECT_ROI', payload: roi.id });
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
        getAllGridLines(box, gridOptions).map((gridLine, index) => (
          <RoiBoxGridLine
            /* eslint-disable-next-line @eslint-react/no-array-index-key */
            key={index}
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
            disabled={isResizeDisabled}
            gridLineOpacity={styles.gridLineOpacity}
          />
        ))}

      {isSelected &&
        getAllCorners(box, roi.box.angle).map((corner) => (
          <RoiBoxCorner
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
            disabled={isResizeDisabled}
            box={box}
            corner={corner}
            roiId={roi.id}
            sizes={handlerSizes}
            handlerColor={styles.resizeHandlerColor}
          />
        ))}

      {isSelected &&
        showRotationHandle &&
        interactions.rotate &&
        (roi.action.type === 'rotating' || roi.action.type === 'idle') && (
          <RoiBoxRotateHandler box={box} styles={styles} />
        )}
    </svg>
  );
}

function getCursor(
  state: RoiState,
  interactions: ResolvedRoiInteractions,
  isAltKeyDown: boolean,
  action: ReactRoiAction,
  canPan: boolean,
): CSSProperties['cursor'] {
  const { mode, selectedRoi } = state;
  if (mode === 'rotate_selected' && selectedRoi) {
    return 'ew-resize';
  }
  if (action !== 'idle') {
    if (action === 'drawing') {
      return 'crosshair';
    }
    if (action === 'moving') {
      return 'move';
    }
    if (action === 'rotating') {
      return 'ew-resize';
    }
    if (action === 'panning') {
      return 'grab';
    }
  }

  if (isAltKeyDown && canPan) return 'grab';

  if (!interactions.select) {
    if (mode !== 'select') {
      if (!isAltKeyDown || !canPan) {
        return 'crosshair';
      }
      return 'grab';
    }
    return canPan ? 'grab' : 'default';
  }

  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (mode) {
    case 'draw':
      return 'crosshair';
    default:
      return interactions.move ? 'move' : 'pointer';
  }
}

function isResizableMode(mode: RoiMode) {
  return mode === 'select' || mode === 'hybrid';
}
