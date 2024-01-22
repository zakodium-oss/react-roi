import { CommittedBox, Size } from '../index';
import { CommittedRoi, Roi } from '../types/Roi';

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
    ...createInitialCommittedBox(),
    ...options,
  };
}

export function createRoi(
  id: string,
  size: Size,
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

export function createCommittedRoiFromRoi<T>(roi: Roi<T>): CommittedRoi<T> {
  const { action, ...obj } = roi;
  return {
    ...obj,
    ...normalizeBox(roi),
  };
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
