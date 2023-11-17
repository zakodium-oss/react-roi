import { Draft } from 'immer';

import { Size } from '../../types';
import { ReactRoiState } from '../roiReducer';

export const initialSize: Size = {
  width: 1,
  height: 1,
};
export function isSizeObserved(data: {
  targetSize: Size;
  containerSize: Size;
}) {
  // Those are initialized to 0 and get updated by the resize observers
  // When both the size of the target and the container are set we can:
  // - Make the target visible
  // - Compute the initial transform which fits the target inside the container
  return data.targetSize.width !== 1 || data.containerSize.width !== 1;
}
export function updateInitialPanZoom(draft: Draft<ReactRoiState>) {
  if (!isSizeObserved(draft)) {
    return;
  }
  const { targetSize, containerSize } = draft;
  const wFactor = targetSize.width / containerSize.width;
  const hFactor = targetSize.height / containerSize.height;
  if (wFactor > 1 || hFactor > 1) {
    // Target is bigger than container
    if (wFactor > hFactor) {
      // Target is wider than container
      draft.initialPanZoom.scale = 1 / hFactor;
      draft.initialPanZoom.translation = [
        -(targetSize.width / hFactor - containerSize.width) / 2,
        0,
      ];
    } else {
      // Target is taller than container
      draft.initialPanZoom.scale = 1 / wFactor;
      draft.initialPanZoom.translation = [
        0,
        -(targetSize.height / wFactor - containerSize.height) / 2,
      ];
    }
  } else {
    // The image is smaller, just center it
    draft.initialPanZoom.scale = 1;
    draft.initialPanZoom.translation = [
      (containerSize.width - targetSize.width) / 2,
      (containerSize.height - targetSize.height) / 2,
    ];
  }
}
