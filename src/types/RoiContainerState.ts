import { RoiMode } from '../context/roiReducer';

export interface RoiContainerState {
  /**
   * Current mode
   */
  mode: RoiMode;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;
}
