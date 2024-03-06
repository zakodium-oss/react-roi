import { Box, CommittedBox, Point } from '..';
import { CommitBoxStrategy } from '../context/roiReducer';
import { RoiAction } from '../types/Roi';

import { assertUnreachable } from './assert';
import { rotatePoint } from './rotate';

export type XCornerPosition = 'left' | 'right' | 'middle';
export type YCornerPosition = 'top' | 'bottom' | 'middle';

export function normalizeBox<T extends Box>(box: T): CommittedBox {
  const { x, y, width, height, angle } = box;

  // Origin goes from center to top left
  // Apply rotation on top left point to get the offset
  const topLeftPoint: Point = { x, y };
  const originPoint: Point = { x: x + width / 2, y: y + height / 2 };
  const newTopLeft = rotatePoint(topLeftPoint, originPoint, angle);
  const newX = x + newTopLeft.x - topLeftPoint.x;
  const newY = y + newTopLeft.y - topLeftPoint.y;
  return {
    x: newX,
    y: newY,
    width,
    height,
    angle,
  };
}

export function denormalizeBox<T extends CommittedBox>(position: T): Box {
  const { x, y, width, height, angle } = position;
  // Origin goes from top left to center
  // Apply rotation on center to get the offset
  const centerPoint: Point = { x: x + width / 2, y: y + height / 2 };
  const originPoint: Point = { x, y };
  const newCenter = rotatePoint(centerPoint, originPoint, angle);
  const newX = x + newCenter.x - centerPoint.x;
  const newY = y + newCenter.y - centerPoint.y;
  return {
    x: newX,
    y: newY,
    width,
    height,
    angle,
  };
}

export function commitBox(
  roi: CommittedBox,
  action: RoiAction,
  strategy: CommitBoxStrategy,
): Box {
  switch (strategy) {
    case 'exact':
      return commitExact(roi);
    case 'round': {
      return commitRound(roi, action);
    }
    default:
      assertUnreachable(strategy);
  }
}

function commitRound(roi: CommittedBox, action: RoiAction): Box {
  const { x, y, width, height, angle } = roi;
  switch (action.type) {
    case 'drawing':
    case 'moving': {
      if (angle === 0) {
        const x1 = Math.round(x);
        const y1 = Math.round(y);
        const x2 = x + width;
        const y2 = y + height;
        return {
          x: x1,
          width: Math.round(x2) - x1,
          y: y1,
          height: Math.round(y2) - y1,
          angle,
        };
      } else {
        return commitExact(roi);
      }
    }
    case 'rotating': {
      return commitExact(roi);
    }
    case 'resizing': {
      let { x, y, width, height } = roi;

      switch (action.xAxisCorner) {
        case 'left': {
          const x2 = x + width;
          width = Math.round(width);
          x = x2 - width;
          break;
        }
        case 'right': {
          width = Math.round(width);
          break;
        }
        case 'middle': {
          // Nothing to do
          break;
        }
        default: {
          assertUnreachable(action.xAxisCorner);
        }
      }
      switch (action.yAxisCorner) {
        case 'top': {
          const y2 = y + height;
          height = Math.round(height);
          y = y2 - height;
          break;
        }
        case 'bottom': {
          height = Math.round(height);
          break;
        }
        case 'middle': {
          // Do nothing
          break;
        }
        default: {
          assertUnreachable(action.yAxisCorner);
        }
      }
      return {
        // We have to round because of precision issues that can cause x and y to become non-integer in calculations
        x: angle === 0 ? Math.round(x) : x,
        y: angle === 0 ? Math.round(y) : y,
        width,
        height,
        angle,
      };
    }
    default: {
      // Idle or other action types are unreachable
      throw new Error('Unreachable');
    }
  }
}

function commitExact(roi: CommittedBox): CommittedBox {
  const { x, y, width, height, angle } = roi;
  return {
    x,
    y,
    width,
    height,
    angle,
  };
}
