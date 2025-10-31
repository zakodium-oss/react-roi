import type { CSSProperties } from 'react';

import type { RoiState } from '../../types/state.js';

export function getCursor(
  roiState: RoiState,
  cursor: CSSProperties['cursor'],
): CSSProperties['cursor'] {
  if (roiState.mode === 'draw') {
    return 'crosshair';
  }

  // In practice, panning should be unreachable here
  // So no need to handle other actions
  if (roiState.action === 'panning') {
    return 'grab';
  }
  return cursor;
}
