import { Box, Size } from '../types';
import { CommittedRoi, Roi } from '../types/Roi';

import { denormalizeBox, normalizeValue } from './coordinates';

function createInitialBox(): Box {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
}

export function createCommitedRoi<T>(
  id: string,
  options: Omit<Partial<CommittedRoi<T>>, 'id'> = {},
): CommittedRoi<T> {
  return {
    id,
    label: '',
    ...createInitialBox(),
    style: {
      backgroundColor: 'black',
      opacity: 0.5,
    },
    editStyle: {
      backgroundColor: 'blue',
      opacity: 0.5,
    },
    ...options,
  };
}

export function createRoi(
  id: string,
  size: Size,
  options: Omit<Partial<Roi>, 'id'> = {},
): Roi {
  const committedRoi = createCommitedRoi(id, options);
  return {
    ...committedRoi,
    action: {
      type: 'idle',
    },
    ...options,
    ...denormalizeBox(committedRoi, size),
  };
}

export function createCommitedRoiFromRoi<T>(
  roi: Roi<T>,
  size: Size,
): CommittedRoi<T> {
  const { action, ...obj } = roi;
  return {
    ...obj,
    x: normalizeValue(roi.x, size.width),
    y: normalizeValue(roi.y, size.height),
    width: normalizeValue(roi.width, size.width),
    height: normalizeValue(roi.height, size.height),
  };
}

export function createRoiFromCommittedRoi<T>(
  roi: CommittedRoi<T>,
  size: Size,
): Roi<T> {
  const { ...otherRoiProps } = roi;
  return {
    ...otherRoiProps,
    action: {
      type: 'idle',
    },
    ...denormalizeBox(roi, size),
  };
}

export function renormalizeRoiPosition(
  position: Box,
  oldSize: Size,
  newSize: Size,
): Box {
  const wFactor = newSize.width / oldSize.width;
  const hFactor = newSize.height / oldSize.height;
  return {
    x: position.x * wFactor,
    y: position.y * hFactor,
    width: position.width * wFactor,
    height: position.height * hFactor,
  };
}
