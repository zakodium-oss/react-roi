import { Draft } from 'immer';

import { Point } from '../../types';
import { Roi } from '../../types/Roi';
import { assert, assertUnreachable } from '../../utilities/assert';
import { ReactRoiState } from '../roiReducer';

export function mouseMove(draft: ReactRoiState, event: MouseEvent) {
  const { selectedRoi, rois } = draft;
  const roi = rois.find((roi) => roi.id === selectedRoi);
  if (!roi) return;
  updateRoiBox(roi, { x: event.movementX, y: event.movementY });
}

export function updateRoiBox(roi: Draft<Roi>, movement: Point) {
  switch (roi.action.type) {
    case 'idle':
      return;
    case 'moving':
      roi.x += movement.x;
      roi.y += movement.y;
      break;
    case 'resizing': {
      resize(roi, movement);
      break;
    }
    case 'drawing':
      resize(roi, movement);
      break;
    default:
      assertUnreachable(roi.action, 'Invalid action type');
  }
}

function resize(roi: Draft<Roi>, movement: Point) {
  assert(roi.action.type === 'resizing' || roi.action.type === 'drawing');

  const xAxisCorner = roi.action.xAxisCorner;
  // Handle X axis
  switch (xAxisCorner) {
    case 'left': {
      const newX = roi.x + movement.x;
      if (newX <= roi.x + roi.width) {
        roi.x = newX;
        roi.width -= movement.x;
      } else {
        roi.x = roi.x + roi.width;
        roi.width = newX - roi.x;
        roi.action.xAxisCorner = 'right';
      }
      break;
    }
    case 'right': {
      const newWidth = roi.width + movement.x;
      if (newWidth >= 0) {
        roi.width = newWidth;
      } else {
        roi.x = roi.x + newWidth;
        roi.width = -newWidth;
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
      const newX = roi.y + movement.y;
      if (newX <= roi.y + roi.height) {
        roi.y = newX;
        roi.height -= movement.y;
      } else {
        roi.y = roi.y + roi.height;
        roi.height = newX - roi.y;
        roi.action.yAxisCorner = 'bottom';
      }
      break;
    }
    case 'bottom': {
      const newWidth = roi.height + movement.y;
      if (newWidth >= 0) {
        roi.height = newWidth;
      } else {
        roi.y = roi.y + newWidth;
        roi.height = -newWidth;
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
