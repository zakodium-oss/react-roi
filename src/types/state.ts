import type { ReactRoiAction, RoiMode } from './utils.js';

export interface RoiState {
  /**
   * Current mode
   */
  mode: RoiMode;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * Current action
   */
  action: ReactRoiAction;
}
