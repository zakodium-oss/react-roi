import type { Draft } from 'immer';

import type { Roi } from '../../types/Roi.ts';
import { assert } from '../../utilities/assert.js';
import { denormalizeBox } from '../../utilities/box.js';
import type { CancelActionPayload, ReactRoiState } from '../roiReducer.js';

export function cancelAction(
  draft: Draft<ReactRoiState>,
  payload: CancelActionPayload,
  /**
   * If you want to cancel action for a specific ROI, provide its ID here.
   * Otherwise, all ROIs with non-idle actions will be cancelled.
   */
  roiId?: string,
) {
  function byRoiId(roi: Roi) {
    return roi.id === roiId;
  }
  function byIdleAction(roi: Roi) {
    return roi.action.type !== 'idle';
  }

  const rois = draft.rois.filter(roiId ? byRoiId : byIdleAction);

  if (rois.length === 0) {
    return;
  }

  for (const roi of rois) {
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
    roi.action = {
      type: 'idle',
    };
  }
  draft.action = 'idle';
}
