import { Draft } from 'immer';

import { Box, Size } from '../../types';
import { CommittedRoi, Roi } from '../../types/Roi';
import { denormalizeBox, normalizeBox } from '../../utilities/coordinates';

function boundRoi<T extends Box>(
  roi: T,
  actionType: Roi['action']['type'],
): Box {
  // Bound points and recalculate width and height
  const result: Box = {
    x: roi.x,
    y: roi.y,
    width: roi.width,
    height: roi.height,
  };

  if (actionType === 'drawing' || actionType === 'resizing') {
    if (result.x < 0) {
      result.width += result.x;
      result.x = 0;
    }
    if (result.y < 0) {
      result.height += result.y;
      result.y = 0;
    }

    // Cut if the ROI is outside the boundaries
    if (result.height + result.y > 1) {
      result.height = 1 - result.y;
    }
    if (result.width + result.x > 1) {
      result.width = 1 - result.x;
    }
  } else {
    // Move back inside the viewport if outside the boundaries
    if (result.x < 0) {
      result.x = 0;
    }
    if (result.y < 0) {
      result.y = 0;
    }
    if (result.x + result.width > 1) {
      result.x = 1 - result.width;
    }
    if (result.y + result.height > 1) {
      result.y = 1 - result.height;
    }
  }
  return result;
}

export function updateCommitedRoiPosition(
  committedRoi: Draft<CommittedRoi>,
  roi: Draft<Roi>,
  size: Size,
) {
  const normalizedBox = boundRoi(normalizeBox(roi, size), roi.action.type);
  if (normalizedBox.height === 0 || normalizedBox.width === 0) {
    // Revert changes since the ROI is no longer visible
    Object.assign<Roi, Box>(roi, denormalizeBox(committedRoi, size));
  } else {
    Object.assign<CommittedRoi, Box>(committedRoi, normalizedBox);
    Object.assign<Roi, Box>(roi, denormalizeBox(committedRoi, size));
  }
}
