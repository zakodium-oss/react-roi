import { assert } from '../../utilities/assert';
import { createCommitedRoiFromRoi } from '../../utilities/rois';
import { ReactRoiState } from '../roiReducer';

import { updateCommitedRoiPosition } from './roi';

export function onMouseUp(draft: ReactRoiState) {
  const { selectedRoi, rois, committedRois } = draft;
  if (!selectedRoi) return;
  const roi = rois.find((roi) => roi.id === selectedRoi);
  const commitedRoi = committedRois.find((roi) => roi.id === selectedRoi);
  assert(roi, 'Selected ROI not found');

  if (!roi) return;

  if (commitedRoi) {
    assert(roi.action.type !== 'drawing', 'Drawing ROI should not be commited');
    updateCommitedRoiPosition(commitedRoi, roi, draft.size);
  } else {
    assert(roi.action.type === 'drawing');
    const newCommitedRoi = createCommitedRoiFromRoi(roi, draft.size);
    updateCommitedRoiPosition(newCommitedRoi, roi, draft.size);
    draft.committedRois.push(newCommitedRoi);
  }
  roi.action = {
    type: 'idle',
  };
}
