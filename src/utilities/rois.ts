import { CommitBoxStrategy, ReactRoiState } from '../context/roiReducer';
import { boundBox, BoundStrategy } from '../context/updaters/roi';
import { CommittedBox, Size } from '../index';
import { CommittedRoi, Roi } from '../types/Roi';

import { assert } from './assert';
import { commitBox, denormalizeBox, normalizeBox } from './coordinates';

function createInitialCommittedBox(): CommittedBox {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
  };
}

export function createCommittedRoi<T>(
  id: string,
  options: Omit<Partial<CommittedRoi<T>>, 'id'> = {},
): CommittedRoi<T> {
  return {
    id,
    label: '',
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
  commitStrategy: CommitBoxStrategy,
): CommittedRoi<T> {
  const { action, ...obj } = roi;
  return {
    ...obj,
    ...boundBox(
      commitBox(normalizeBox(roi), roi.action, commitStrategy),
      targetSize,
      strategy,
    ),
  };
}

export function createCommittedRoiFromRoiIfValid<T>(
  roi: Roi<T>,
  options: {
    targetSize: Size;
    minNewRoiSize: number;
  },
  boundStrategy: BoundStrategy,
  commitStrategy: CommitBoxStrategy,
): CommittedRoi<T> | null {
  const newCommittedRoi = createCommittedRoiFromRoi(
    roi,
    options.targetSize,
    boundStrategy,
    commitStrategy,
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
