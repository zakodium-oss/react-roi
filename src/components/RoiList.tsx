import { CSSProperties, JSX, ReactNode, SVGAttributes } from 'react';

import { useRoiState } from '..';
import { useRois } from '../hooks/useRois';
import { Roi } from '../types/Roi';
import { assert } from '../utilities/assert';

import { RoiBox } from './box/RoiBox';
import { defaultGridLineOpacity, defaultHandlerColor } from './constants';
import { LabelContainer } from './label/LabelContainer';

export interface RoiAdditionalCallbackState {
  isSelected: boolean;
  isReadOnly: boolean;
  zoomScale: number;
}

export interface CustomRoiStyle {
  /**
   * The attributes to forward to the SVG rect element which draws the ROI
   */
  rectAttributes?: SVGAttributes<SVGRectElement>;
  resizeHandlerColor?: CSSProperties['color'];
  gridLineOpacity?: CSSProperties['opacity'];
  /**
   * This property allows to render custom markup inside the ROI SVG
   * This can be used for example to render an svg pattern that can then be used as a fill in `rectAttributes`
   * It is not meant to be used to render markup that will be displayed on screen, see `rectAttributes` to customize the ROI appearance
   */
  renderCustomPattern?: () => JSX.Element;
}

export type GetStyleCallback<TData = unknown> = (
  roi: Roi<TData>,
  roiAdditionalState: RoiAdditionalCallbackState,
) => CustomRoiStyle;

export type GetReadOnlyCallback<TData = unknown> = (roi: Roi<TData>) => boolean;
export type GetOverlayOpacity<TData = unknown> = (
  roi: Roi<TData>,
  roiAdditionalState: RoiAdditionalCallbackState,
) => number;
export type RenderLabelCallback<TData = unknown> = (
  roi: Roi<TData>,
  roiAdditionalState: RoiAdditionalCallbackState,
) => ReactNode;

export interface RoiListProps<TData = unknown> {
  getStyle?: GetStyleCallback<TData>;
  getReadOnly?: GetReadOnlyCallback<TData>;
  renderLabel?: RenderLabelCallback<TData>;
  getOverlayOpacity?: GetOverlayOpacity<TData>;
  allowRotate?: boolean;
  showGrid?: boolean;
}

export function RoiList<TData = unknown>(props: RoiListProps<TData>) {
  const {
    getStyle = defaultGetStyle,
    getReadOnly = () => false,
    getOverlayOpacity = () => 0,
    renderLabel = defaultRenderLabel,
    allowRotate = false,
    showGrid = false,
  } = props;
  const rois = useRois().slice();
  const { selectedRoi } = useRoiState();
  if (selectedRoi) {
    const index = rois.findIndex((roi) => roi.id === selectedRoi);
    assert(index !== -1, 'Selected ROI not found');
    const roi = rois.splice(index, 1)[0];
    rois.push(roi);
  }

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
          allowRotate={allowRotate}
          isSelected={roi.id === selectedRoi}
          showGrid={showGrid}
        />
      ))}
    </>
  );
}

const defaultGetStyle: GetStyleCallback = (roi, state) => {
  return {
    rectAttributes: {
      fill: state.isReadOnly
        ? 'rgba(0,0,0,0.6)'
        : state.isSelected
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
