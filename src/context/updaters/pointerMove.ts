import { Draft } from 'immer';

import { Box, Point } from '../..';
import { Roi } from '../../types/Roi';
import { assert, assertUnreachable } from '../../utilities/assert';
import {
  applyInverseX,
  applyInverseY,
  computeTotalPanZoom,
} from '../../utilities/panZoom';
import {
  computeAngleFromMousePosition,
  rotateBox,
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
      if (roi.angle === 0) {
        resize(draft, roi, movement);
      } else {
        resizeWithAngle(draft, roi, movement);
      }
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
  roi.x1 += movementX;
  roi.y1 += movementY;
  roi.x2 += movementX;
  roi.y2 += movementY;
}

function resizeWithAngle(
  draft: Draft<ReactRoiState>,
  roi: Draft<Roi>,
  movement: Point,
) {
  const totalPanZoom = computeTotalPanZoom(draft);
  assert(roi.action.type === 'resizing' || roi.action.type === 'drawing');
  const movementX = movement.x / totalPanZoom.scale;
  const movementY = movement.y / totalPanZoom.scale;
  const { xAxisCorner, yAxisCorner } = roi.action;
  console.log(xAxisCorner);
  switch (xAxisCorner) {
    case 'left': {
      const newBox = getMovement({ x: movementX, y: movementY }, roi);
      console.log(newBox);
      roi.x1 = newBox.x1;
      roi.y1 = newBox.y1;
      roi.x2 = newBox.x2;
      roi.y2 = newBox.y2;
      break;
    }
    default: {
      throw new Error('todo: implement');
    }
  }
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
      const newX = roi.x1 + movementX;
      if (newX <= roi.x2) {
        roi.x1 = newX;
      } else {
        roi.x1 = roi.x2;
        roi.x2 = newX;
        roi.action.xAxisCorner = 'right';
      }
      break;
    }
    case 'right': {
      const newX = roi.x2 + movementX;

      if (newX >= roi.x1) {
        roi.x2 = newX;
      } else {
        roi.x2 = roi.x1;
        roi.x1 = newX;
        roi.action.xAxisCorner = 'left';
      }
      break;
    }
    case 'middle':
      // Don't touch x
      break;
    default:
      assertUnreachable(xAxisCorner);
  }

  // Handle Y axis
  const yAxisCorner = roi.action.yAxisCorner;
  switch (yAxisCorner) {
    case 'top': {
      const newY = roi.y1 + movementY;
      if (newY <= roi.y2) {
        roi.y1 = newY;
      } else {
        roi.y1 = roi.y2;
        roi.y2 = newY;
        roi.action.yAxisCorner = 'bottom';
      }
      break;
    }
    case 'bottom': {
      const newY = roi.y2 + movementY;
      if (newY >= roi.y1) {
        roi.y2 = newY;
      } else {
        roi.y2 = roi.y1;
        roi.y1 = newY;
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

function getMovement(movement: Point, box: Box): Omit<Box, 'angle'> {
  const rotatedBox = rotateBox(box, box.angle);

  const newRotatedBox = {
    x1: rotatedBox.x1 + movement.x,
    y1: rotatedBox.y1 + movement.y,
    x2: rotatedBox.x2,
    y2: rotatedBox.y2,
  };
  const newBox = rotateBox(newRotatedBox, -box.angle);

  return newBox;
}
