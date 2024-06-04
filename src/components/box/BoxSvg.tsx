import { CSSProperties } from 'react';

import { GetStyleCallback, ReactRoiAction, RoiMode, useRoiState } from '../..';
import { useIsKeyDown } from '../../hooks/useIsKeyDown';
import { useLockContext } from '../../hooks/useLockContext';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { Box } from '../../utilities/box';
import { getAllCorners } from '../../utilities/corners';
import { getAllEdges, getAllGridLines } from '../../utilities/grid';

import { RoiBoxCorner } from './RoiBoxCorner';
import { RoiBoxEdge } from './RoiBoxEdge';
import { RoiBoxGridLine } from './RoiBoxGridLine';
import { RoiBoxRotateHandler } from './RoiBoxRotateHandler';
import { getHandlerSizes } from './sizes';
import { baseRoiStyle } from './styles';

export interface BoxAnnotationProps {
  roi: Roi;
  box: Box;
  style?: CSSProperties;
  className?: string;
  isReadOnly: boolean;
  getStyle: GetStyleCallback;
  allowRotate: boolean;
  showGrid: boolean;
}

export function BoxSvg({
  roi,
  style,
  className,
  isReadOnly,
  getStyle,
  box,
  allowRotate,
  showGrid,
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
        showGrid &&
        getAllGridLines(box).map((gridLine, idx) => (
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
            gridLineOpacity={styles.gridLineOpacity}
          />
        ))}

      {isSelected &&
        getAllCorners(box, roi.box.angle).map((corner) => (
          <RoiBoxCorner
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
            corner={corner}
            roiId={roi.id}
            sizes={handlerSizes}
            handlerColor={styles.resizeHandlerColor}
          />
        ))}

      {isSelected &&
        allowRotate &&
        (roi.action.type === 'rotating' || roi.action.type === 'idle') && (
          <RoiBoxRotateHandler box={box} styles={styles} />
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
