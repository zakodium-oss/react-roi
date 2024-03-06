import { assert } from '../../utilities/assert';
import { createCommittedRoiFromRoiIfValid } from '../../utilities/rois';
import { EndActionPayload, ReactRoiState } from '../roiReducer';

import { cancelAction } from './cancelAction';
import { updateCommittedRoiPosition } from './roi';

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
    try {
      updateCommittedRoiPosition(draft, committedRoi, roi);
    } catch {
      return cancelAction(draft, { noUnselection: false });
    }
  } else {
    assert(roi.action.type === 'drawing');
    const newCommittedRoi = createCommittedRoiFromRoiIfValid(roi, {
      targetSize: draft.targetSize,
      minNewRoiSize: payload.minNewRoiSize,
      strategy: 'resize',
      commitStrategy: draft.commitRoiBoxStrategy,
    });
    if (newCommittedRoi === null) {
      // Roi is not valid, remove it
      const index = draft.rois.findIndex((r) => r.id === roi.id);
      draft.rois.splice(index, 1);
      if (payload.noUnselection) {
        draft.selectedRoi = roi.action.previousSelectedRoi;
      } else {
        draft.selectedRoi = undefined;
      }
    } else {
      try {
        updateCommittedRoiPosition(draft, newCommittedRoi, roi);
        draft.committedRois.push(newCommittedRoi);
      } catch {
        return cancelAction(draft, { noUnselection: false });
      }
    }
  }
  roi.action = {
    type: 'idle',
  };
}
