import type { Roi } from '../types/Roi.ts';
import type { BoundaryStrategy } from '../types/utils.ts';

import { assertUnreachable } from './assert.ts';

export type BoundaryUpdateStrategy =
  /**
   * Translates the box so that it fits inside the target.
   * Not supported if box is rotated.
   */
  | 'move_inside'
  /**
   * Resize the box so that it fits inside the target.
   * Not supported if box is rotated.
   */
  | 'resize_inside'
  /**
   * Does not override the box position.
   */
  | 'none'
  /**
   * Does not override the box position, unless it is completely outside the target, in which case the operation is cancelled.
   */
  | 'is_partially_inside'

  /**
   * Does not override the box position, unless it is partially outside the target, in which case the operation is cancelled.
   */
  | 'is_inside';

export function getBoundaryStrategyFromAction(
  roi: Roi,
  strategy: BoundaryStrategy,
): BoundaryUpdateStrategy {
  if (roi.action.type === 'external') {
    return 'none';
  }

  switch (strategy) {
    case 'none':
      return 'none';
    case 'partially_inside':
      return 'is_partially_inside';
    case 'inside':
      return 'is_inside';
    case 'inside_auto': {
      if (roi.box.angle !== 0) {
        // Currently, the automatic strategy is not supported for rotated boxes
        // So we fall back to a simpler strategy
        return 'is_inside';
      }

      if (roi.action.type === 'moving' || roi.action.type === 'rotating') {
        return 'move_inside';
      } else {
        return 'resize_inside';
      }
    }
    default: {
      assertUnreachable(strategy);
    }
  }
}
