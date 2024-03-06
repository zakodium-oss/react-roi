import { Draft } from 'immer';

import { initBox } from '../../utilities/coordinates';
import { ReactRoiState } from '../roiReducer';

import { boundBox } from './roi';

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
