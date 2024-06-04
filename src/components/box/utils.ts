import { CSSProperties } from 'react';

import { RoiState } from '../../types/state';

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
