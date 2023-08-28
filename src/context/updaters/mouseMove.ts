import { Draft } from 'immer';

import { Point } from '../../types';
import { Roi } from '../../types/Roi';
import { assert, assertUnreachable } from '../../utilities/assert';
import { ReactRoiState } from '../roiReducer';

export function mouseMove(draft: ReactRoiState, event: MouseEvent) {
  switch (draft.action) {
    case 'idle':
      return;
    case 'panning':
      draft.panZoom.translation[0] += event.movementX;
      draft.panZoom.translation[1] += event.movementY;
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
  const movementX = movement.x / draft.panZoom.scale;
  const movementY = movement.y / draft.panZoom.scale;
  switch (roi.action.type) {
    case 'idle':
      return;
    case 'moving':
      roi.x += movementX;
      roi.y += movementY;
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
  assert(roi.action.type === 'resizing' || roi.action.type === 'drawing');
  const movementX = movement.x / draft.panZoom.scale;
  const movementY = movement.y / draft.panZoom.scale;
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
      const newX = roi.y + movementY;
      if (newX <= roi.y + roi.height) {
        roi.y = newX;
        roi.height -= movementY;
      } else {
        roi.y = roi.y + roi.height;
        roi.height = newX - roi.y;
        roi.action.yAxisCorner = 'bottom';
      }
      break;
    }
    case 'bottom': {
      const newWidth = roi.height + movementY;
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
