import { CSSProperties } from 'react';

import { XAxisCorner, YAxisCorner } from '../utilities/coordinates';

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
  xAxisCorner: XAxisCorner;
  /**
   * Position of the corner actioned along the y axis.
   */
  yAxisCorner: YAxisCorner;
}

export interface MoveAction {
  /**
   * Action of moving an existing ROI box
   */
  type: 'moving';
}

export interface IdleAction {
  /**
   * No action is being performed
   */
  type: 'idle';
}

export interface DrawAction extends Omit<ResizeAction, 'type'> {
  type: 'drawing';
}

export type RoiAction = IdleAction | DrawAction | MoveAction | ResizeAction;

export interface Roi<TData = unknown> extends Box {
  id: string;
  label?: string;
  action: RoiAction;
  style: CSSProperties;
  editStyle: CSSProperties;
  data?: TData;
}

export interface CommittedRoi<TData = unknown>
  extends Omit<Roi<TData>, 'action'> {}
