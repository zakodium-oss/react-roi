import type { CSSProperties, JSX, ReactNode, SVGAttributes } from 'react';

import type { Roi, RoiAction } from './Roi.ts';

export interface GlobalStateCallbackPayload {
  /**
   * The current zoom scale.
   */
  zoomScale: number;
}

export type RoiCallbackPayload<TData = unknown> = Pick<
  Roi<TData>,
  'id' | 'box' | 'label' | 'data'
> & {
  action: RoiAction['type'];
  isSelected: boolean;
  isReadOnly: boolean;
};

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
  roi: RoiCallbackPayload<TData>,
  globalState: GlobalStateCallbackPayload,
) => CustomRoiStyle;

export type GetReadOnlyCallback<TData = unknown> = (roi: Roi<TData>) => boolean;
export type GetOverlayOpacity<TData = unknown> = (
  roi: RoiCallbackPayload<TData>,
  globalState: GlobalStateCallbackPayload,
) => number;

export type RenderLabelCallback<TData = unknown> = (
  roi: RoiCallbackPayload<TData>,
  globalState: GlobalStateCallbackPayload,
) => ReactNode;
