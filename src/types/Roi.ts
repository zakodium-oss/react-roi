import { XCornerPosition, YCornerPosition } from '../utilities/coordinates';

import { Box, CommittedBox } from './utils';

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

export type CommittedRoi<TData = unknown> = Omit<Roi<TData>, 'action'> &
  CommittedBox;
