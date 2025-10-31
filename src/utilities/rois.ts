import { CommittedBox, CommittedRoiProperties } from '..';
import { CommitBoxStrategy } from '../context/roiReducer';
import { boundBox, BoundStrategy } from '../context/updaters/roi';
import { Roi, RoiAction } from '../types/Roi';
import { Size } from '../types/utils';

import { assert } from './assert';
import { commitBox, denormalizeBox, normalizeBox } from './box';

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
  options: Omit<Partial<CommittedRoiProperties<T>>, 'id'> = {},
): CommittedRoiProperties<T> {
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
    box: denormalizeBox(committedRoi),
  };
}

interface CreateCommittedRoiFromRoiOptions {
  targetSize: Size;
  commitStrategy: CommitBoxStrategy;
}

function getBoundStrategyFromAction(action: RoiAction): BoundStrategy {
  if (action.type === 'moving' || action.type === 'rotating') {
    return 'move';
  } else {
    return 'resize';
  }
}

export function createCommittedRoiFromRoi<T>(
  roi: Roi<T>,
  options: CreateCommittedRoiFromRoiOptions,
): CommittedRoiProperties<T> {
  const strategy = getBoundStrategyFromAction(roi.action);
  const { targetSize, commitStrategy } = options;
  const { action, ...obj } = roi;
  return {
    ...obj,
    ...boundBox(
      commitBox(normalizeBox(roi.box), roi.action, commitStrategy),
      targetSize,
      strategy,
    ),
  };
}

export function createCommittedRoiFromRoiIfValid<T>(
  roi: Roi<T>,
  options: CreateCommittedRoiFromRoiOptions & { minNewRoiSize: number },
): CommittedRoiProperties<T> | null {
  const newCommittedRoi = createCommittedRoiFromRoi(roi, options);
  if (
    newCommittedRoi.width < options.minNewRoiSize ||
    newCommittedRoi.height < options.minNewRoiSize
  ) {
    return null;
  }
  return newCommittedRoi;
}

export function createRoiFromCommittedRoi<T>(
  roi: CommittedRoiProperties<T>,
): Roi<T> {
  const { x, y, width, height, ...otherRoiProps } = roi;
  return {
    ...otherRoiProps,
    action: {
      type: 'idle',
    },
    box: denormalizeBox(roi),
  };
}

export function roiHasChanged(
  previous: CommittedRoiProperties | undefined,
  next: CommittedRoiProperties | undefined,
) {
  if (previous === undefined && next === undefined) {
    return false;
  }
  if (previous === undefined || next === undefined) {
    return true;
  }
  assert(previous.id === next.id, 'roi not found');
  return (
    previous.x !== next.x ||
    previous.y !== next.y ||
    previous.width !== next.width ||
    previous.height !== next.height ||
    previous.angle !== next.angle
  );
}
