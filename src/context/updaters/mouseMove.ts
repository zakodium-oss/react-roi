import { Draft } from 'immer';

import { Point } from '../..';
import { Roi } from '../../types/Roi';
import { assert, assertUnreachable } from '../../utilities/assert';
import { computeTotalPanZoom } from '../../utilities/panZoom';
import { ReactRoiState } from '../roiReducer';

import { rectifyPanZoom } from './rectifyPanZoom';

export function mouseMove(draft: ReactRoiState, event: MouseEvent) {
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
    case 'resizing': {
      const { selectedRoi, rois } = draft;
      const roi = rois.find((roi) => roi.id === selectedRoi);
      assert(roi);
      updateRoiBox(draft, roi, { x: event.movementX, y: event.movementY });
      return;
    }
    default:
      assertUnreachable(draft.action, 'Invalid action type');
  }
}

export function updateRoiBox(
  draft: Draft<ReactRoiState>,
  roi: Draft<Roi>,
  movement: Point,
) {
  const totalPanZoom = computeTotalPanZoom(draft);
  const movementX = movement.x / totalPanZoom.scale;
  const movementY = movement.y / totalPanZoom.scale;
  switch (roi.action.type) {
    case 'idle':
      return;
    case 'moving':
      roi.x1 += movementX;
      roi.y1 += movementY;
      roi.x2 += movementX;
      roi.y2 += movementY;
      break;
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
