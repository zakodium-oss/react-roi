import { Draft } from 'immer';

import { Size } from '../..';
import { assertUnreachable } from '../../utilities/assert';
import { ReactRoiState } from '../roiReducer';

// Initial values are set to 1 and not 0 to avoid division by 0
export const initialSize: Size = {
  width: 1,
  height: 1,
};
export function isSizeObserved(data: {
  targetSize: Size;
  containerSize: Size;
}) {
  // Those are initialized to a fixed value and get updated by the resize observers
  // When both the size of the target and the container are set we can:
  // - Make the target visible
  // - Compute the initial transform which fits the target inside the container
  return (
    data.targetSize.width !== initialSize.height ||
    data.containerSize.width !== initialSize.width
  );
}
export function updateInitialPanZoom(draft: Draft<ReactRoiState>) {
  if (!isSizeObserved(draft)) {
    return;
  }
  switch (draft.resizeStrategy) {
    case 'contain':
      updateInitialPanZoomContain(draft);
      break;
    case 'cover':
      updateInitialPanZoomCover(draft);
      break;
    case 'center':
      updateInitialPanZoomCenter(draft);
      break;
    case 'none':
      updateInitialPanZoomNone(draft);
      break;
    default:
      assertUnreachable(draft.resizeStrategy);
  }
}

function updateInitialPanZoomCover(draft: Draft<ReactRoiState>) {
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
    updateInitialPanZoomCenter(draft);
  }
}

function updateInitialPanZoomContain(draft: Draft<ReactRoiState>) {
  const { targetSize, containerSize } = draft;
  const wFactor = targetSize.width / containerSize.width;
  const hFactor = targetSize.height / containerSize.height;
  if (wFactor > 1 || hFactor > 1) {
    // Target is bigger than container
    if (wFactor > hFactor) {
      // Target is wider than container
      draft.initialPanZoom.scale = 1 / wFactor;
      updateInitialPanZoomCenter(draft);
    } else {
      // Target is taller than container
      draft.initialPanZoom.scale = 1 / hFactor;
      updateInitialPanZoomCenter(draft);
    }
  } else {
    // The image is smaller, just center it
    draft.initialPanZoom.scale = 1;
    updateInitialPanZoomCenter(draft);
  }
}

function updateInitialPanZoomCenter(draft: Draft<ReactRoiState>) {
  const { targetSize, containerSize, initialPanZoom } = draft;
  draft.initialPanZoom.translation = [
    // 0, 0,
    (containerSize.width - initialPanZoom.scale * targetSize.width) / 2,
    (containerSize.height - initialPanZoom.scale * targetSize.height) / 2,
  ];
}

function updateInitialPanZoomNone(draft: Draft<ReactRoiState>) {
  draft.initialPanZoom.scale = 1;
  draft.initialPanZoom.translation = [0, 0];
}
