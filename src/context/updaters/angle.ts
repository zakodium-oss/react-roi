import type { Draft } from 'immer';

import { assert } from '../../utilities/assert.ts';
import { changeBoxRotationCenter } from '../../utilities/box.ts';
import { createRoiFromCommittedRoi } from '../../utilities/rois.ts';
import { normalizeAngle } from '../../utilities/rotate.ts';
import type { ReactRoiState, UpdateAnglePayload } from '../roiReducer.tsx';

import { cancelAction } from './cancelAction.ts';
import { updateCommittedRoiPosition } from './roi.ts';

export function updateAngle(
  draft: Draft<ReactRoiState>,
  payload: UpdateAnglePayload,
) {
  const {
    id,
    angle,
    options = {
      commit: true,
      boundaryStrategy: 'none',
      xRotationCenter: 'left',
      yRotationCenter: 'top',
    },
  } = payload;
  if (!id) return;
  const index = draft.rois.findIndex((roi) => roi.id === id);

  assert(index !== -1, 'ROI not found');
  if (options.commit) {
    const committedRoi = draft.committedRois[index];
    assert(committedRoi, 'Committed ROI not found');
    draft.rois[index] = createRoiFromCommittedRoi(committedRoi);
    const roi = draft.rois[index];
    roi.box = changeBoxRotationCenter(roi.box, options);
    roi.box.angle = normalizeAngle(angle);
    try {
      updateCommittedRoiPosition(draft, committedRoi, draft.rois[index], {
        boundaryStrategy: options.boundaryStrategy ?? 'none',
        boxStrategy: 'exact',
      });
    } catch {
      cancelAction(draft, { noUnselection: false }, id);
    }
  } else {
    const roi = draft.rois[index];
    roi.box = changeBoxRotationCenter(roi.box, options);
    roi.box.angle = normalizeAngle(angle);
    roi.action = { type: 'external' };
  }
}
