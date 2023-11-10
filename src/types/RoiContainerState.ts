import { RoiMode } from './utils';

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
