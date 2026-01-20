import type { BoundaryStrategy } from './utils.ts';

export type UpdateRoiOptions =
  | UpdateRoiOptionsNoCommit
  | UpdateRoiOptionsWithCommit;

export interface UpdateRoiOptionsNoCommit {
  /**
   * Whether the update should be committed immediately.
   * In both cases, the ROI will move immediately on screen.
   * If set to false, the ROI will enter a mode where it can't be modified through user interactions until committed.
   * Setting it to false also prevents having frequent updates to committed ROIs when those can trigger expensive operations.
   */
  commit: false;
}

// The inside_auto strategy is excluded because it requires to know about the nature of the action (move, resize, etc.).
export type UpdateRoiOptionsBoundaryStrategy = Exclude<
  BoundaryStrategy,
  'inside_auto'
>;

export interface UpdateRoiOptionsWithCommit {
  commit: true;
  boundaryStrategy?: UpdateRoiOptionsBoundaryStrategy;
}

export type XRotationCenter = 'left' | 'right' | 'center';
export type YRotationCenter = 'top' | 'bottom' | 'center';

interface UpdateRoiRotationOptions {
  xRotationCenter: XRotationCenter;
  yRotationCenter: YRotationCenter;
}

export type RotateRoiOptions =
  | (UpdateRoiOptionsWithCommit & UpdateRoiRotationOptions)
  | (UpdateRoiOptionsNoCommit & UpdateRoiRotationOptions);
