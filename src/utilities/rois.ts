import { ReactRoiState } from '../context/roiReducer';
import { boundRoi, BoundStrategy } from '../context/updaters/roi';
import { CommittedBox, Size } from '../index';
import { CommittedRoi, Roi } from '../types/Roi';

import { assert } from './assert';
import { denormalizeBox, normalizeBox } from './coordinates';

function createInitialCommittedBox(): CommittedBox {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
}

export function createCommittedRoi<T>(
  id: string,
  options: Omit<Partial<CommittedRoi<T>>, 'id'> = {},
): CommittedRoi<T> {
  return {
    id,
    label: '',
    angle: 0,
    ...createInitialCommittedBox(),
    ...options,
  };
}

export function createRoi(
  id: string,
  options: Omit<Partial<Roi>, 'id'> = {},
): Roi {
  const committedRoi = createCommittedRoi(id, options);
  const { x, y, width, height, ...otherRoiProps } = committedRoi;
  return {
    ...otherRoiProps,
    action: {
      type: 'idle',
    },
    ...denormalizeBox(committedRoi),
  };
}

export function createCommittedRoiFromRoi<T>(
  roi: Roi<T>,
  targetSize: Size,
  strategy: BoundStrategy,
): CommittedRoi<T> {
  const { action, ...obj } = roi;
  return {
    ...obj,
    ...boundRoi(normalizeBox(roi), targetSize, strategy),
  };
}

export function createCommittedRoiFromRoiIfValid<T>(
  roi: Roi<T>,
  options: {
    targetSize: Size;
    minNewRoiSize: number;
  },
  boundStrategy: BoundStrategy,
): CommittedRoi<T> | null {
  const newCommittedRoi = createCommittedRoiFromRoi(
    roi,
    options.targetSize,
    boundStrategy,
  );
  if (
    newCommittedRoi.width < options.minNewRoiSize ||
    newCommittedRoi.height < options.minNewRoiSize
  ) {
    return null;
  }
  return newCommittedRoi;
}

export function createRoiFromCommittedRoi<T>(roi: CommittedRoi<T>): Roi<T> {
  const { x, y, width, height, ...otherRoiProps } = roi;
  return {
    ...otherRoiProps,
    action: {
      type: 'idle',
    },
    ...denormalizeBox(roi),
  };
}

export function roiHasChanged(state: ReactRoiState, roi: CommittedRoi) {
  const currentRoi = state.committedRois.find((r) => r.id === roi.id);
  assert(currentRoi, 'roi not found');
  return (
    currentRoi.x !== roi.x ||
    currentRoi.y !== roi.y ||
    currentRoi.width !== roi.width ||
    currentRoi.height !== roi.height
  );
}
