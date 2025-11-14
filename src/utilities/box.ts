import type { CommitBoxStrategy } from '../context/roiReducer.js';
import type {
  RoiAction,
  XCornerPosition,
  YCornerPosition,
} from '../types/Roi.js';
import type { CommittedBox } from '../types/box.js';
import type { PanZoom } from '../types/utils.js';

import { assertUnreachable } from './assert.js';
import { applyTransformX, applyTransformY } from './panZoom.js';
import type { Point } from './point.js';
import { rotatePoint, rotatePointCommittedBox } from './rotate.js';

export interface Box {
  /**
   * Left position of box
   */
  x: number;
  /**
   * Top position of box
   */
  y: number;
  /**
   * Width of box.
   */
  width: number;
  /**
   * Height of box
   */
  height: number;
}

export type XRotationCenter = 'left' | 'right' | 'center';
export type YRotationCenter = 'top' | 'bottom' | 'center';

/**
 * Represents the coordinates and angle of a box
 * Units are pixels in the client's coordinates system and relative to the container's position.
 */
export interface BoxWithRotationCenter {
  xRotationCenter: XRotationCenter;
  yRotationCenter: YRotationCenter;
  /**
   * Top left position of the ROI box relative to the container
   */
  x: number;
  /**
   * Top position of the ROI box relative to the container
   */
  y: number;
  /**
   * Width of the ROI box.
   */
  width: number;
  /**
   * Height of the ROI box in absolute units (px).
   */
  height: number;
  /**
   * Rotation angle around the center of the ROI in radians
   */
  angle: number;
}

export interface CenterOrigin {
  xRotationCenter: XRotationCenter;
  yRotationCenter: YRotationCenter;
}

export function getBoxPoints(
  box: CommittedBox | BoxWithRotationCenter,
): [Point, Point, Point, Point] {
  // Box:
  // p0 ------ p1
  // |         |
  // p3 ------ p2
  const p0 = rotatePointCommittedBox({ x: box.x, y: box.y }, box);
  const p1 = rotatePointCommittedBox({ x: box.x + box.width, y: box.y }, box);
  const p2 = rotatePointCommittedBox(
    { x: box.x + box.width, y: box.y + box.height },
    box,
  );

  const p3 = rotatePointCommittedBox({ x: box.x, y: box.y + box.height }, box);

  return [p0, p1, p2, p3];
}

export function applyTransformToBox(panzoom: PanZoom, box: Box): Box {
  const x2 = box.x + box.width;
  const y2 = box.y + box.height;
  const x = applyTransformX(panzoom, box.x);
  const y = applyTransformY(panzoom, box.y);
  return {
    x,
    y,
    width: applyTransformX(panzoom, x2) - x,
    height: applyTransformY(panzoom, y2) - y,
  };
}

export function normalizeBox(box: BoxWithRotationCenter): CommittedBox {
  const { x, y, width, height, angle } = box;

  // Origin goes from center to top left
  // Apply rotation on top left point to get the offset
  const topLeftPoint: Point = { x, y };
  const originPoint = getRotationCenter(box);
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

export function denormalizeBox(box: CommittedBox): BoxWithRotationCenter {
  return {
    ...box,
    xRotationCenter: 'left',
    yRotationCenter: 'top',
  };
}

export function initBox(
  box: CommittedBox,
  strategy: CommitBoxStrategy,
): CommittedBox {
  switch (strategy) {
    case 'exact':
      return box;
    case 'round': {
      const { x, y, width, height, angle } = box;
      if (angle === 0) {
        const x1 = Math.round(x);
        const y1 = Math.round(y);
        const x2 = Math.round(x + width);
        const y2 = Math.round(y + height);
        return {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1,
          angle,
        };
      } else {
        const denormalized = denormalizeBox(box);
        const width = Math.round(denormalized.width);
        const height = Math.round(denormalized.height);

        const x = box.x + (box.width - width) / 2;
        const y = box.y + (box.height - height) / 2;
        return { x, y, width, height, angle };
      }
    }
    default:
      assertUnreachable(strategy);
  }
}

export function commitBox(
  roi: CommittedBox,
  action: RoiAction,
  strategy: CommitBoxStrategy,
): CommittedBox {
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

function commitRound(roi: CommittedBox, action: RoiAction): CommittedBox {
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
    case 'rotating_free':
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
        case 'center': {
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
        case 'center': {
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
    case 'external': {
      throw new Error('External action type should not be reachable here');
    }
    case 'idle': {
      throw new Error('Idle action type should not be reachable here');
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

export function getRotationCenter(box: BoxWithRotationCenter): Point {
  let { x, y } = box;
  switch (box.xRotationCenter) {
    case 'left':
      // Nothing to do
      break;
    case 'right': {
      x += box.width;
      break;
    }
    case 'center': {
      x += box.width / 2;
      break;
    }
    default:
      assertUnreachable(box.xRotationCenter);
  }

  // Switch statement for yRotationCenter
  switch (box.yRotationCenter) {
    case 'top':
      // Nothing to do
      break;
    case 'bottom': {
      y += box.height;
      break;
    }
    case 'center': {
      y += box.height / 2;
      break;
    }
    default:
      assertUnreachable(box.yRotationCenter);
  }
  return { x, y };
}

export function changeBoxRotationCenter(
  box: BoxWithRotationCenter,
  newCenter: CenterOrigin,
): BoxWithRotationCenter {
  const oldRotationCenter = getRotationCenter(box);
  const altPoint = getRotationCenter({ ...box, ...newCenter });
  const newCenterPoint = rotatePoint(altPoint, oldRotationCenter, box.angle);
  const newPoint = getTopLeft(newCenterPoint, {
    ...box,
    ...newCenterPoint,
    ...newCenter,
  });

  return {
    ...box,
    ...newCenter,
    ...newPoint,
  };
}

export function isBoxWithRotationCenter(
  box: CommittedBox | BoxWithRotationCenter,
): box is BoxWithRotationCenter {
  return 'xRotationCenter' in box;
}

function getTopLeft(point: Point, box: BoxWithRotationCenter): Point {
  let { x, y } = point;
  switch (box.xRotationCenter) {
    case 'left':
      // Nothing to do
      break;
    case 'right': {
      x -= box.width;
      break;
    }
    case 'center': {
      x -= box.width / 2;
      break;
    }
    default:
      assertUnreachable(box.xRotationCenter);
  }
  switch (box.yRotationCenter) {
    case 'top':
      // Nothing to do
      break;
    case 'bottom': {
      y -= box.height;
      break;
    }
    case 'center': {
      y -= box.height / 2;
      break;
    }
    default:
      assertUnreachable(box.yRotationCenter);
  }
  return { x, y };
}

export const xAxisCornerToCenter: Record<XCornerPosition, XRotationCenter> = {
  left: 'right',
  right: 'left',
  center: 'center',
};
export const yAxisCornerToCenter: Record<YCornerPosition, YRotationCenter> = {
  top: 'bottom',
  bottom: 'top',
  center: 'center',
};

export function getRectanglePoints(box: CommittedBox): Point[] {
  const { x, y, width, height, angle } = box;
  const center: Point = { x, y };
  return [
    center,
    rotatePoint({ x: x + width, y }, center, angle),
    rotatePoint({ x: x + width, y: y + height }, center, angle),
    rotatePoint({ x, y: y + height }, center, angle),
  ];
}
