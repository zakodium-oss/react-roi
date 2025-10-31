import type { Draft } from 'immer';

import { assert } from '../../utilities/assert.js';
import { changeBoxRotationCenter } from '../../utilities/box.js';
import type { ReactRoiState } from '../roiReducer.js';

export function selectBoxAndStartAction(
  draft: Draft<ReactRoiState>,
  id: string,
  action: 'rotating' | 'moving',
) {
  if (draft.mode === 'draw') {
    draft.selectedRoi = undefined;
    return;
  }
  const { rois } = draft;
  draft.selectedRoi = id;
  const roi = rois.find((roi) => roi.id === id);
  assert(roi, 'ROI not found');
  draft.action = action;

  roi.action = {
    type: action,
  };
  roi.box = changeBoxRotationCenter(roi.box, {
    xRotationCenter: 'center',
    yRotationCenter: 'center',
  });
}
