import { XCornerPosition, YCornerPosition } from '../utilities/coordinates';

import { Box } from './utils';

export type ActionType = 'resizing' | 'moving' | 'drawing' | 'idle';

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

export interface DrawAction extends Omit<ResizeAction, 'type'> {
  type: 'drawing';
  previousSelectedRoi?: string;
}

export type RoiAction =
  | IdleAction
  | DrawAction
  | MoveAction
  | RotateAction
  | ResizeAction;

export interface Roi<TData = unknown> extends Box {
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
  data?: TData;
}

export interface CommittedRoi<TData = unknown>
  extends Omit<Roi<TData>, 'action' | 'x1' | 'x2' | 'y1' | 'y2'> {
  /**
   * Left position of the ROI box relatively to the viewport of the target. The value is in the [0, 1] domain.
   */
  x: number;
  /**
   * Top position of the ROI box relatively to the viewport of the target. The value is in the [0, 1] domain.
   */
  y: number;
  /**
   * Width of the ROI box relatively to the viewport of the target. The value is in the [0, 1] domain.
   */
  width: number;
  /**
   * Height of the ROI box relatively to the viewport of the target. The value is in the [0, 1] domain.
   */
  height: number;
}
