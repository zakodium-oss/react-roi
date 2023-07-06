import { RoiAction } from '../context/RoiContext';

import { Delta } from './Delta';
import { Point } from './Point';
import { Ratio } from './Ratio';
import { RoiObject } from './RoiObject';

export type RoiStateType = {
  /**
   * @param action Current action
   */
  action: RoiAction;

  /**
   * @param delta offset from the point where the click was made to the top-left corner of the rectangle
   */
  delta?: Delta;

  /**
   * @param roiID Identification of the selected object
   */
  roiID?: string;

  /**
   * position object with the startPoint (top-left) and endPoint (bottom-right) of the rectangle
   */
  position?: number;

  /**
   * @param startPoint Point at the top-left of the rectangle.
   */
  startPoint?: Point;

  /**
   * @param endPoint Point at the bottom-right of the rectangle.
   */
  endPoint?: Point;

  /**
   * @param ratio ratio of the width and height of the image related to the window, measured in pixels
   */
  ratio: Ratio;

  /**
   * @param origin of the SVG relative to the entire window
   */
  origin: { row: number; column: number };

  /**
   * @param pointerIndex offset index of the selected pointer
   */
  pointerIndex?: number;

  /**
   * position object with the startPoint (top-left) and endPoint (bottom-right) of the rectangle
   */
  width: number;

  /**
   * position object with the startPoint (top-left) and endPoint (bottom-right) of the rectangle
   */
  height: number;

  /**
   * @param rois
   */

  rois: RoiObject[];
};
