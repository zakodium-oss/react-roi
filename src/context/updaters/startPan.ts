import type { Draft } from 'immer';

import type { ReactRoiState } from '../roiReducer.js';

export function startPan(draft: Draft<ReactRoiState>) {
  if (draft.action !== 'idle') {
    return;
  }
  draft.action = 'panning';
}
