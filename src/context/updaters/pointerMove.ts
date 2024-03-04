import { Draft } from 'immer';

import { Point } from '../..';
import { Roi } from '../../types/Roi';
import { assert, assertUnreachable } from '../../utilities/assert';
import {
  applyInverseX,
  applyInverseY,
  computeTotalPanZoom,
} from '../../utilities/panZoom';
import {
  add,
  mulScalar,
  scalarMultiply,
  subtract,
} from '../../utilities/point';
import {
  computeAngleFromMousePosition,
  rotatePoint,
} from '../../utilities/rotate';
import { PointerMovePayload, ReactRoiState } from '../roiReducer';

import { rectifyPanZoom } from './rectifyPanZoom';

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

      roi.angle = computeAngleFromMousePosition({ x, y }, roi);
      break;
    }
    case 'resizing': {
      resizeWithAngle(draft, roi, movement);
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
  roi.x += movementX;
  roi.y += movementY;
}

function resize(draft: Draft<ReactRoiState>, roi: Draft<Roi>, movement: Point) {
  const totalPanZoom = computeTotalPanZoom(draft);
  assert(roi.action.type === 'resizing' || roi.action.type === 'drawing');
  const movementX = movement.x / totalPanZoom.scale;
  const movementY = movement.y / totalPanZoom.scale;
  const xAxisCorner = roi.action.xAxisCorner;
  // Handle X axis
  switch (xAxisCorner) {
    case 'left': {
      const newX = roi.x + movementX;
      if (newX <= roi.x + roi.width) {
        roi.x = newX;
        roi.width -= movementX;
      } else {
        roi.x = roi.x + roi.width;
        roi.width = newX - roi.x;
        roi.action.xAxisCorner = 'right';
      }
      break;
    }
    case 'right': {
      const newWidth = roi.width + movementX;
      if (newWidth >= 0) {
        roi.width = newWidth;
      } else {
        roi.x = roi.x + newWidth;
        roi.width = -newWidth;
        roi.action.xAxisCorner = 'left';
      }
      break;
    }
    case 'middle': {
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
      const newY = roi.y + movementY;
      if (newY <= roi.y + roi.height) {
        roi.y = newY;
        roi.height -= movementY;
      } else {
        roi.y = roi.y + roi.height;
        roi.height = newY - roi.y;
        roi.action.yAxisCorner = 'bottom';
      }
      break;
    }
    case 'bottom': {
      const newHeight = roi.height + movementY;
      if (newHeight >= 0) {
        roi.height = newHeight;
      } else {
        roi.y = roi.y + newHeight;
        roi.height = -newHeight;
        roi.action.yAxisCorner = 'top';
      }
      break;
    }
    case 'middle':
      // Don't touch y
      break;
    default:
      assertUnreachable(yAxisCorner);
  }
}

function resizeWithAngle(
  draft: Draft<ReactRoiState>,
  roi: Draft<Roi>,
  movement: Point,
) {
  const totalPanZoom = computeTotalPanZoom(draft);
  assert(roi.action.type === 'resizing' || roi.action.type === 'drawing');
  const { xAxisCorner, yAxisCorner } = roi.action;
  const movementX = movement.x / totalPanZoom.scale;
  const movementY = movement.y / totalPanZoom.scale;

  const movementPoint = { x: movementX, y: movementY };
  const halfMovementPoint = mulScalar(movementPoint, 0.5);
  const rotatedDelta = rotatePoint(movementPoint, { x: 0, y: 0 }, -roi.angle);
  const projectionBase = rotatePoint({ x: 1, y: 0 }, { x: 0, y: 0 }, roi.angle);
  const projectionX = mulScalar(
    projectionBase,
    scalarMultiply(halfMovementPoint, projectionBase),
  );
  const projectionY = subtract(halfMovementPoint, projectionX);

  let newCenter: Point = {
    x: roi.x + roi.width / 2,
    y: roi.y + roi.height / 2,
  };

  let newWidth = roi.width;
  let newHeight = roi.height;
  switch (xAxisCorner) {
    case 'right': {
      newWidth = roi.width + rotatedDelta.x;
      newCenter = add(newCenter, projectionX);
      if (newWidth < 0) {
        newWidth = -newWidth;
        roi.action.xAxisCorner = 'left';
      }
      break;
    }
    case 'left': {
      newWidth = roi.width - rotatedDelta.x;
      newCenter = add(newCenter, projectionX);
      if (newWidth < 0) {
        newWidth = -newWidth;
        roi.action.xAxisCorner = 'right';
      }
      break;
    }
    case 'middle': {
      // Nothing to do on x
      break;
    }
    default: {
      // do nothing
      assertUnreachable(xAxisCorner);
    }
  }

  switch (yAxisCorner) {
    case 'bottom': {
      newHeight = roi.height + rotatedDelta.y;
      newCenter = add(newCenter, projectionY);
      if (newHeight < 0) {
        newHeight = -newHeight;
        roi.action.yAxisCorner = 'top';
      }
      break;
    }
    case 'top': {
      newHeight = roi.height - rotatedDelta.y;
      newCenter = add(newCenter, projectionY);
      if (newHeight < 0) {
        newHeight = -newHeight;
        roi.action.yAxisCorner = 'bottom';
      }
      break;
    }
    case 'middle': {
      // No effect on y
      break;
    }
    default: {
      assertUnreachable(yAxisCorner);
    }
  }

  roi.x = newCenter.x - newWidth / 2;
  roi.y = newCenter.y - newHeight / 2;
  roi.width = newWidth;
  roi.height = newHeight;
}
