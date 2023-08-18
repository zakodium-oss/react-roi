import { RoiMode } from '../context/roiReducer';

import { Ratio } from './Ratio';

export interface RoiContainerState {
  /**
   * Current mode
   */
  mode: RoiMode;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * The ratio of the width to the height of the original object is in relation to the target width and height, and it is measured in pixels.
   */
  ratio: Ratio;
}
