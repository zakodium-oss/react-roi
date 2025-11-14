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
   * Action of rotating an existing ROI, by using the ROI's rotation handle.
   * The rotation is computed such that the line between the rotation center
   * and the pointer is a line parallel to the rectangle's sides.
   */
  type: 'rotating';
}

export interface RotateFreeAction {
  /**
   * Action of rotating the ROI by computing the angle only from the pointer's
   * movement on the X axis.
   */
  type: 'rotating_free';
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
  | RotateFreeAction
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
