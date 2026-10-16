import type { Draft } from 'immer';

import { initBox } from '../../utilities/box.js';
import type { ReactRoiState } from '../roiReducer.js';

import { boundBox } from './roi.js';

export function sanitizeRois(draft: Draft<ReactRoiState>) {
  for (let index = 0; index < draft.committedRois.length; index++) {
    const roi = draft.committedRois[index];
    draft.committedRois[index] = {
      ...roi,
      ...boundBox(
        initBox(roi, draft.commitRoiBoxStrategy),
        draft.targetSize,
        'move_inside',
      ),
    };
  }
}
