import { DynamicActions } from '../context/DynamicContext';
import { DataObject } from './DataObject';
import { Delta } from './Delta';
import { Offset } from './Offset';
import { Point } from './Point';
import { Ratio } from './Ratio';

export type DynamicStateType = {
  /**
   * @param action Current action
   */
  action: DynamicActions;

  /**
   * @param delta offset from the point where the click was made to the top-left corner of the rectangle
   */
  delta?: Delta;

  /**
   * @param objectID Identification of the selected object
   */
  objectID?: string;

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
   * @param offset offset information for the SVG relative to the entire window
   */
  offset: Offset;

  /**
   * @param pointerIndex offset index of the selected pointer
   */
  pointerIndex?: number;

  /**
   * @param objects
   */

  objects: DataObject[];
};
