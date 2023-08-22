import { Draft } from 'immer';

import { Box } from '../../types';
import { Roi } from '../../types/Roi';
import { assert } from '../../utilities/assert';
import { denormalizeBox } from '../../utilities/coordinates';
import { ReactRoiState } from '../roiReducer';

export function cancelAction(draft: Draft<ReactRoiState>) {
  const rois = draft.rois.filter((roi) => roi.action.type !== 'idle');

  if (rois.length === 0) {
    return;
  }
  assert(rois.length === 1, 'Multiple rois are being edited at the same time');

  const roi = rois[0];
  if (roi.action.type === 'drawing') {
    const roiIndex = draft.rois.findIndex((r) => r.id === roi.id);
    draft.rois.splice(roiIndex, 1);
  } else {
    // Revert to the previous state
    const committedRoi = draft.committedRois.find((r) => r.id === roi.id);
    assert(committedRoi);
    Object.assign<Roi, Box>(roi, denormalizeBox(committedRoi, draft.size));
  }
  roi.action = {
    type: 'idle',
  };
}