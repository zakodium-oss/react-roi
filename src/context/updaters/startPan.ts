import { Draft } from 'immer';

import { ReactRoiState } from '../roiReducer';

export function startPan(draft: Draft<ReactRoiState>) {
  if (draft.action !== 'idle') {
    return;
  }
  draft.action = 'panning';
}
