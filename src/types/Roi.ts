import { CSSProperties, ReactNode } from 'react';

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
  /**
   * An id which uniquely identifies for the ROI.
   */
  id: string;
  /**
   * Label to display inside the ROI box.
   */
  label?: ReactNode;
  /**
   * Action being currently performed on the ROI box.
   */
  action: RoiAction;
  /**
   * Style of the ROI box when not being selected or edited.
   */
  style: CSSProperties;
  /**
   * Style applied to the ROI box when being selected.
   */
  selectedStyle: CSSProperties;
  /**
   * Metadata of any kind associated with the ROI.
   */
  data?: TData;
  /**
   * Left position of the ROI box in absolute units (px).
   */
  x: number;
  /**
   * Top position of the ROI box in absolute units (px).
   */
  y: number;
  /**
   * Width of the ROI box in absolute units (px).
   */
  width: number;
  /**
   * Height of the ROI box in absolute units (px).
   */
  height: number;
}

export interface CommittedRoi<TData = unknown>
  extends Omit<Roi<TData>, 'action'> {
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
