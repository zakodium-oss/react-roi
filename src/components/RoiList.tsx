import { useMemo } from 'react';

import { useRois } from '../hooks/useRois.js';
import { useRoiState } from '../index.js';
import type {
  GetOverlayOpacity,
  GetReadOnlyCallback,
  GetStyleCallback,
  RenderLabelCallback,
} from '../types/RoiList.ts';
import { assert } from '../utilities/assert.js';

import { RoiBox } from './box/RoiBox.js';
import { defaultGridLineOpacity, defaultHandlerColor } from './constants.js';
import { LabelContainer } from './label/LabelContainer.js';

export interface RoiListProps<TData = unknown> {
  getStyle?: GetStyleCallback<TData>;
  getReadOnly?: GetReadOnlyCallback<TData>;
  renderLabel?: RenderLabelCallback<TData>;
  getOverlayOpacity?: GetOverlayOpacity<TData>;
  displayRotationHandle?: boolean;
  showGrid?: boolean;
  /**
   * Spacing (in device pixels) between vertical grid lines along the horizontal axis.
   * If not provided, grid lines will be spaced by `horizontalGridSize` pixels.
   */
  gridSpacingX?: number;
  /**
   * Spacing (in device pixels) between horizontal grid lines along the vertical axis.
   * If not provided, grid lines will be spaced by `verticalGridSize` pixels.
   */
  gridSpacingY?: number;
  /**
   * Number of horizontal grid lines.
   * horizontalGridSpacing takes precedence if both are provided.
   * @default 2
   */
  gridHorizontalLineCount?: number;
  /**
   * Number of vertical grid lines
   * verticalGridSpacing takes precedence if both are provided.
   * @default 2
   */
  gridVerticalLineCount?: number;
}

export function RoiList<TData = unknown>(props: RoiListProps<TData>) {
  const {
    getStyle = defaultGetStyle,
    getReadOnly = () => false,
    getOverlayOpacity = () => 0,
    renderLabel = defaultRenderLabel,
    displayRotationHandle = false,
    showGrid = false,
    gridHorizontalLineCount = 2,
    gridVerticalLineCount = 2,
    gridSpacingX,
    gridSpacingY,
  } = props;
  const rois = useRois().slice();
  const { selectedRoi } = useRoiState();
  if (selectedRoi) {
    const index = rois.findIndex((roi) => roi.id === selectedRoi);
    assert(index !== -1, 'Selected ROI not found');
    const roi = rois.splice(index, 1)[0];
    rois.push(roi);
  }
  const gridOptions = useMemo(() => {
    return {
      gridHorizontalLineCount,
      gridVerticalLineCount,
      gridSpacingX,
      gridSpacingY,
    };
  }, [
    gridHorizontalLineCount,
    gridVerticalLineCount,
    gridSpacingX,
    gridSpacingY,
  ]);

  return (
    <>
      {rois.map((roi) => (
        <RoiBox
          key={roi.id}
          roi={roi}
          getStyle={getStyle as GetStyleCallback}
          renderLabel={renderLabel as RenderLabelCallback}
          getReadOnly={getReadOnly as GetReadOnlyCallback}
          getOverlayOpacity={getOverlayOpacity as GetOverlayOpacity}
          displayRotationHandle={displayRotationHandle}
          isSelected={roi.id === selectedRoi}
          showGrid={showGrid}
          gridOptions={gridOptions}
        />
      ))}
    </>
  );
}

const defaultGetStyle: GetStyleCallback = ({ isReadOnly, isSelected }) => {
  return {
    rectAttributes: {
      fill: isReadOnly
        ? 'rgba(0,0,0,0.6)'
        : isSelected
          ? 'rgba(0,0,0,0.2)'
          : 'rgba(0,0,0,0.4)',
    },
    resizeHandlerColor: defaultHandlerColor,
    gridLineOpacity: defaultGridLineOpacity,
  };
};

const defaultRenderLabel: RenderLabelCallback = (roi) => {
  return <LabelContainer>{roi.label}</LabelContainer>;
};
