import { assert } from '../../utilities/assert';
import { createCommittedRoiFromRoi } from '../../utilities/rois';
import { EndActionPayload, ReactRoiState } from '../roiReducer';

import { updateCommitedRoiPosition } from './roi';

export function endAction(draft: ReactRoiState, payload: EndActionPayload) {
  draft.action = 'idle';
  const { selectedRoi, rois, committedRois } = draft;
  if (!selectedRoi) return;
  const roi = rois.find((roi) => roi.id === selectedRoi);
  const committedRoi = committedRois.find((roi) => roi.id === selectedRoi);

  if (!roi) return;

  if (committedRoi) {
    assert(
      roi.action.type !== 'drawing',
      'Drawing ROI should not be committed',
    );
    updateCommitedRoiPosition(draft, committedRoi, roi);
  } else {
    assert(roi.action.type === 'drawing');
    const newCommittedRoi = createCommittedRoiFromRoi(roi);
    if (
      newCommittedRoi.width < payload.minNewRoiSize ||
      newCommittedRoi.height < payload.minNewRoiSize
    ) {
      // User simply clicked, don't add the ROI
      // Select previously selected ROI
      const index = draft.rois.findIndex((r) => r.id === newCommittedRoi.id);
      draft.rois.splice(index, 1);
      if (payload.noUnselection) {
        draft.selectedRoi = roi.action.previousSelectedRoi;
      } else {
        draft.selectedRoi = undefined;
      }
    } else {
      updateCommitedRoiPosition(draft, newCommittedRoi, roi);
      draft.committedRois.push(newCommittedRoi);
    }
  }
  roi.action = {
    type: 'idle',
  };
}
