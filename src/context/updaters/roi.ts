import { Draft } from 'immer';

import { Box, CommittedBox, Size } from '../..';
import { CommittedRoi, Roi } from '../../types/Roi';
import { denormalizeBox, normalizeBox } from '../../utilities/coordinates';
import { ReactRoiState } from '../roiReducer';

function boundRoi<T extends CommittedBox>(
  committedBox: T,
  targetSize: Size,
  actionType: Roi['action']['type'],
): CommittedBox {
  // Bound points and recalculate width and height
  const result: CommittedBox = {
    x: committedBox.x,
    y: committedBox.y,
    width: committedBox.width,
    height: committedBox.height,
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
    if (result.height + result.y > targetSize.height) {
      result.height = targetSize.height - result.y;
    }
    if (result.width + result.x > targetSize.width) {
      result.width = targetSize.width - result.x;
    }
  } else {
    // Move back inside the viewport if outside the boundaries
    if (result.x < 0) {
      result.x = 0;
    }
    if (result.y < 0) {
      result.y = 0;
    }
    if (result.x + result.width > targetSize.width) {
      result.x = targetSize.width - result.width;
    }
    if (result.y + result.height > targetSize.height) {
      result.y = targetSize.height - result.height;
    }
  }
  return result;
}

export function updateCommitedRoiPosition(
  draft: ReactRoiState,
  committedRoi: Draft<CommittedRoi>,
  roi: Draft<Roi>,
) {
  const normalizedBox = boundRoi(
    normalizeBox(roi),
    draft.targetSize,
    roi.action.type,
  );
  if (normalizedBox.height === 0 || normalizedBox.width === 0) {
    // Revert changes since the ROI is no longer visible
    Object.assign<Roi, Box>(roi, denormalizeBox(committedRoi));
  } else {
    Object.assign<CommittedRoi, CommittedBox>(committedRoi, normalizedBox);
    Object.assign<Roi, Box>(roi, denormalizeBox(committedRoi));
  }
}
