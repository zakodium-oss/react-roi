import type { Draft } from 'immer';

import type {
  MoveAction,
  RotateAction,
  RotateFreeAction,
} from '../../types/Roi.js';
import { assert } from '../../utilities/assert.js';
import { changeBoxRotationCenter } from '../../utilities/box.js';
import type { ReactRoiState } from '../roiReducer.js';

export function selectBoxAndStartAction(
  draft: Draft<ReactRoiState>,
  id: string,
  action: RotateFreeAction | RotateAction | MoveAction,
) {
  if (draft.mode === 'draw') {
    draft.selectedRoi = undefined;
    return;
  }
  draft.selectedRoi = id;
  prepareSelectedBoxForAction(draft, action);
}

export function prepareSelectedBoxForAction(
  draft: Draft<ReactRoiState>,
  action: RotateFreeAction | RotateAction | MoveAction,
) {
  if (!draft.selectedRoi) {
    return;
  }
  const roi = draft.rois.find((roi) => roi.id === draft.selectedRoi);
  assert(roi, 'ROI not found');
  draft.action = action.type === 'rotating_free' ? 'rotating' : action.type;

  roi.action = action;
  roi.box = changeBoxRotationCenter(roi.box, {
    xRotationCenter: 'center',
    yRotationCenter: 'center',
  });
}
