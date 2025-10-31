import type { Draft } from 'immer';

import type { DrawAction, ResizeAction, Roi } from '../../types/Roi.js';
import { assert, assertUnreachable } from '../../utilities/assert.js';
import {
  applyInverseX,
  applyInverseY,
  computeTotalPanZoom,
} from '../../utilities/panZoom.js';
import type { Point } from '../../utilities/point.js';
import {
  computeAngleFromMousePosition,
  rotatePoint,
} from '../../utilities/rotate.js';
import type {
  CommitBoxStrategy,
  PointerMovePayload,
  ReactRoiState,
} from '../roiReducer.js';

import { rectifyPanZoom } from './rectifyPanZoom.js';

export function pointerMove(draft: ReactRoiState, payload: PointerMovePayload) {
  const { event } = payload;
  switch (draft.action) {
    case 'idle':
      return;
    case 'panning':
      draft.panZoom.translation[0] += event.movementX;
      draft.panZoom.translation[1] += event.movementY;
      rectifyPanZoom(draft);
      return;
    case 'moving':
    case 'drawing':
    case 'rotating':
    case 'resizing': {
      const { selectedRoi, rois } = draft;
      const roi = rois.find((roi) => roi.id === selectedRoi);
      assert(roi);
      updateRoiBox(draft, roi, payload);
      return;
    }
    default:
      assertUnreachable(draft.action, 'Invalid action type');
  }
}

export function updateRoiBox(
  draft: Draft<ReactRoiState>,
  roi: Draft<Roi>,
  payload: PointerMovePayload,
) {
  const { event, containerBoundingRect } = payload;
  const movement = { x: event.movementX, y: event.movementY };
  switch (roi.action.type) {
    case 'idle':
      return;
    case 'moving':
      move(draft, roi, movement);
      break;
    case 'rotating': {
      const totalPanZoom = computeTotalPanZoom(draft);
      const x = applyInverseX(
        totalPanZoom,
        event.clientX - containerBoundingRect.x,
      );
      const y = applyInverseY(
        totalPanZoom,
        event.clientY - containerBoundingRect.y,
      );

      roi.box.angle = computeAngleFromMousePosition({ x, y }, roi.box);
      break;
    }
    case 'resizing': {
      resize(draft, roi, movement);
      break;
    }
    case 'drawing':
      resize(draft, roi, movement);
      break;
    default:
      assertUnreachable(roi.action, 'Invalid action type');
  }
}

function move(draft: Draft<ReactRoiState>, roi: Draft<Roi>, movement: Point) {
  const totalPanZoom = computeTotalPanZoom(draft);
  const movementX = movement.x / totalPanZoom.scale;
  const movementY = movement.y / totalPanZoom.scale;
  roi.box.x += movementX;
  roi.box.y += movementY;
}

function resize(draft: Draft<ReactRoiState>, roi: Draft<Roi>, movement: Point) {
  const totalPanZoom = computeTotalPanZoom(draft);
  assert(roi.action.type === 'resizing' || roi.action.type === 'drawing');
  const movementXScaled = movement.x / totalPanZoom.scale;
  const movementYScaled = movement.y / totalPanZoom.scale;
  const movementPoint = { x: movementXScaled, y: movementYScaled };
  const { x: movementXExact, y: movementYExact } = rotatePoint(
    movementPoint,
    { x: 0, y: 0 },
    -roi.box.angle,
  );
  const { x: movementX, y: movementY } = getMovementAndUpdateRemainder(
    roi.action,
    { x: movementXExact, y: movementYExact },
    draft.commitRoiBoxStrategy,
  );

  const xAxisCorner = roi.action.xAxisCorner;
  const box = roi.box;
  // Handle X axis
  switch (xAxisCorner) {
    case 'left': {
      const newX = box.x + movementX;
      if (newX <= box.x + box.width) {
        box.x = newX;
        box.width -= movementX;
      } else {
        box.x = box.x + box.width;
        box.width = newX - box.x;
        roi.action.xAxisCorner = 'right';
        roi.box.xRotationCenter = 'left';
      }
      break;
    }
    case 'right': {
      const newWidth = box.width + movementX;
      if (newWidth >= 0) {
        box.width = newWidth;
      } else {
        box.x = box.x + newWidth;
        box.width = -newWidth;
        roi.action.xAxisCorner = 'left';
        roi.box.xRotationCenter = 'right';
      }
      break;
    }
    case 'center': {
      // Don't touch x
      break;
    }
    default:
      assertUnreachable(xAxisCorner);
  }

  // Handle Y axis
  const yAxisCorner = roi.action.yAxisCorner;
  switch (yAxisCorner) {
    case 'top': {
      const newY = box.y + movementY;
      if (newY <= box.y + box.height) {
        box.y = newY;
        box.height -= movementY;
      } else {
        box.y = box.y + box.height;
        box.height = newY - box.y;
        roi.action.yAxisCorner = 'bottom';
        roi.box.yRotationCenter = 'top';
      }
      break;
    }
    case 'bottom': {
      const newHeight = box.height + movementY;
      if (newHeight >= 0) {
        box.height = newHeight;
      } else {
        box.y = box.y + newHeight;
        box.height = -newHeight;
        roi.action.yAxisCorner = 'top';
        roi.box.yRotationCenter = 'bottom';
      }
      break;
    }
    case 'center':
      // Don't touch y
      break;
    default:
      assertUnreachable(yAxisCorner);
  }
}

function getMovementAndUpdateRemainder(
  action: Draft<ResizeAction> | Draft<DrawAction>,
  movement: Point,
  strategy: CommitBoxStrategy,
): Point {
  let { x, y } = movement;
  if (strategy === 'round') {
    x += action.remainder.x;
    y += action.remainder.y;
    const movementX = Math.round(x);
    const movementY = Math.round(y);
    action.remainder = {
      x: x - movementX,
      y: y - movementY,
    };
    return { x: movementX, y: movementY };
  }
  return movement;
}
