import { RoiAction } from '../context/RoiContext';

import { CommittedRoi } from './CommittedRoi';
import { Ratio } from './Ratio';
import { Roi } from './Roi';

export interface RoiContainerState<T = unknown> {
  /**
   * Current mode
   */
  mode: RoiAction;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * The ratio of the width to the height of the original object is in relation to the target width and height, and it is measured in pixels.
   */
  ratio: Ratio;

  /**
   * rois
   */
  rois: Array<Roi<T>>;

  /**
   * commited rois
   */
  commitedRois: Array<CommittedRoi<T>>;
}
