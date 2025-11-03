import type { Draft } from 'immer';

import { initBox } from '../../utilities/box.js';
import type { ReactRoiState } from '../roiReducer.js';

import { boundBox } from './roi.js';

export function sanitizeRois(draft: Draft<ReactRoiState>) {
  for (let idx = 0; idx < draft.committedRois.length; idx++) {
    const roi = draft.committedRois[idx];
    draft.committedRois[idx] = {
      ...roi,
      ...boundBox(
        initBox(roi, draft.commitRoiBoxStrategy),
        draft.targetSize,
        'move',
      ),
    };
  }
}
