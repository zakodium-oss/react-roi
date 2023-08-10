import { RoiAction } from '../context/RoiContext';

import { Delta } from './Delta';
import { Point } from './Point';
import { Ratio } from './Ratio';
import { Roi } from './Roi';

export interface RoiContainerState<T = unknown> {
  /**
   * Current mode
   */
  mode: RoiAction;

  /**
   * offset from the point where the click was made to the top-left corner of the rectangle
   */
  delta?: Delta;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * Point at the top-left of the rectangle.
   */
  startPoint?: Point;

  /**
   * Point at the bottom-right of the rectangle.
   */
  endPoint?: Point;

  /**
   * The ratio of the width to the height of the original object is in relation to the target width and height, and it is measured in pixels.
   */
  ratio: Ratio;

  /**
   * The horizontal origin of the container in relation to the entire window.
   */
  x: number;

  /**
   * The vertical origin of the container in relation to the entire window.
   */
  y: number;

  /**
   * offset index of the selected pointer
   */
  pointerIndex?: number;

  /**
   * The width of the target input
   */
  width: number;

  /**
   * The height of the target input
   */
  height: number;

  /**
   * rois
   */
  rois: Array<Roi<T>>;
}
