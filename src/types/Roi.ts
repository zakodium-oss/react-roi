import type { BoxWithRotationCenter } from '../utilities/box.js';
import type { Point } from '../utilities/point.js';

export type XCornerPosition = 'left' | 'right' | 'center';
export type YCornerPosition = 'top' | 'bottom' | 'center';

export interface ResizeAction {
  /**
   * Action of resizing an existing ROI box
   */
  type: 'resizing';
  /**
   * Position of the corner actioned along the x axis.
   */
  xAxisCorner: XCornerPosition;
  /**
   * Position of the corner actioned along the y axis.
   */
  yAxisCorner: YCornerPosition;
  /**
   * The update of roi coordinates must happen in round increments, so we keep the remainder here for the next update.
   */
  remainder: Point;
}

export interface MoveAction {
  /**
   * Action of moving an existing ROI box
   */
  type: 'moving';
}

export interface RotateAction {
  /**
   * Action of rotating an existing ROI
   */
  type: 'rotating';
}

export interface IdleAction {
  /**
   * No action is being performed
   */
  type: 'idle';
}

export interface ExternalAction {
  /**
   * The roi is being updated through an external action
   */
  type: 'external';
}

export interface DrawAction extends Omit<ResizeAction, 'type'> {
  type: 'drawing';
  previousSelectedRoi?: string;
}

export type RoiAction =
  | IdleAction
  | DrawAction
  | MoveAction
  | RotateAction
  | ResizeAction
  | ExternalAction;

export interface Roi<TData = unknown> {
  /**
   * An id which uniquely identifies for the ROI.
   */
  id: string;
  /**
   * Label to display inside the ROI box.
   */
  label?: string;
  /**
   * Action being currently performed on the ROI box.
   */
  action: RoiAction;
  /**
   * Metadata of any kind associated with the ROI.
   */

  box: BoxWithRotationCenter;
  data?: TData;
}
