import { Box, CommittedBox, Size } from '../index';
import { CommittedRoi, Roi } from '../types/Roi';

import { denormalizeBox, normalizeValue } from './coordinates';

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
    ...denormalizeBox(committedRoi, size),
  };
}

export function createCommittedRoiFromRoi<T>(
  roi: Roi<T>,
  size: Size,
): CommittedRoi<T> {
  const { action, ...obj } = roi;
  return {
    ...obj,
    x: normalizeValue(roi.x1, size.width),
    y: normalizeValue(roi.y1, size.height),
    width: normalizeValue(roi.x2 - roi.x1, size.width),
    height: normalizeValue(roi.y2 - roi.y1, size.height),
  };
}

export function createRoiFromCommittedRoi<T>(
  roi: CommittedRoi<T>,
  size: Size,
): Roi<T> {
  const { x, y, width, height, ...otherRoiProps } = roi;
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
    x1: Math.floor(position.x1 * wFactor),
    y1: Math.floor(position.y1 * hFactor),
    x2: Math.floor(position.x2 * wFactor),
    y2: Math.floor(position.y2 * hFactor),
  };
}
