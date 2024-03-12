import { Draft } from 'immer';

import { assert } from '../../utilities/assert';
import { denormalizeBox } from '../../utilities/box';
import { CancelActionPayload, ReactRoiState } from '../roiReducer';

export function cancelAction(
  draft: Draft<ReactRoiState>,
  payload: CancelActionPayload,
) {
  const rois = draft.rois.filter((roi) => roi.action.type !== 'idle');

  if (rois.length === 0) {
    return;
  }
  assert(rois.length === 1, 'Multiple rois are being edited at the same time');

  const roi = rois[0];
  if (roi.action.type === 'drawing') {
    const roiIndex = draft.rois.findIndex((r) => r.id === roi.id);
    draft.rois.splice(roiIndex, 1);
    if (payload.noUnselection) {
      draft.selectedRoi = roi.action.previousSelectedRoi;
    } else {
      draft.selectedRoi = undefined;
    }
  } else {
    // Revert to the previous state
    const committedRoi = draft.committedRois.find((r) => r.id === roi.id);
    assert(committedRoi);
    roi.box = denormalizeBox(committedRoi);
  }
  draft.action = 'idle';
  roi.action = {
    type: 'idle',
  };
}
