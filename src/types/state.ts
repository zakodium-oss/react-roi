import { ReactRoiAction, RoiMode } from './utils';

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
