import type { Draft } from 'immer';

import type {
  CommittedBox,
  CommittedRoiProperties,
  Size,
} from '../../index.js';
import type { Roi, RoiAction } from '../../types/Roi.js';
import {
  commitBox,
  denormalizeBox,
  normalizeBox,
} from '../../utilities/box.js';
import { getMBRBoundaries } from '../../utilities/rotate.js';
import type { ReactRoiState } from '../roiReducer.js';

export type BoundingStrategy = 'move' | 'resize' | 'none';

export function boundBox(
  committedBox: CommittedBox,
  targetSize: Size,
  /**
   * Strategy to bound the ROI box. If `move`, the ROI box will be moved so that it fits inside the target.
   * If `resize`, the ROI box will be resized so that it fits inside the target.
   */
  strategy: BoundingStrategy,
): CommittedBox {
  if (strategy === 'none') {
    return committedBox;
  }

  // Bound points and recalculate width and height
  const result: CommittedBox = {
    x: committedBox.x,
    y: committedBox.y,
    width: committedBox.width,
    height: committedBox.height,
    angle: committedBox.angle,
  };

  if (result.angle !== 0) {
    const mbr = getMBRBoundaries(committedBox);
    if (
      mbr.minX < 0 ||
      mbr.minY < 0 ||
      mbr.maxX > targetSize.width ||
      mbr.maxY > targetSize.height
    ) {
      throw new Error('Resize with rotation not implemented');
    }
  } else if (strategy === 'resize') {
    if (result.x < 0) {
      result.width += result.x;
      result.x = 0;
    }
    if (result.y < 0) {
      result.height += result.y;
      result.y = 0;
    }

    // Cut if the ROI is outside the boundaries
    if (result.height + result.y > targetSize.height) {
      result.height = targetSize.height - result.y;
    }
    if (result.width + result.x > targetSize.width) {
      result.width = targetSize.width - result.x;
    }
  } else {
    const mbr = getMBRBoundaries(committedBox);
    // Move back inside the viewport if outside the boundaries
    if (mbr.minX < 0) {
      result.x -= mbr.minX;
    }
    if (mbr.minY < 0) {
      result.y -= mbr.minY;
    }
    if (mbr.maxX > targetSize.width) {
      result.x -= mbr.maxX - targetSize.width;
    }
    if (mbr.maxY > targetSize.height) {
      result.y -= mbr.maxY - targetSize.height;
    }
  }
  return result;
}

const boundingStrategyMap: Record<RoiAction['type'], BoundingStrategy> = {
  resizing: 'resize',
  drawing: 'resize',
  idle: 'move',
  moving: 'move',
  // If rotating, use move since it does not change the overall size of the ROI
  rotating: 'move',
  // eslint-disable-next-line camelcase
  rotating_free: 'move',
  external: 'none',
};

export function updateCommittedRoiPosition(
  draft: ReactRoiState,
  committedRoi: Draft<CommittedRoiProperties>,
  roi: Draft<Roi>,
) {
  const normalizedBox = boundBox(
    commitBox(normalizeBox(roi.box), roi.action, draft.commitRoiBoxStrategy),
    draft.targetSize,
    boundingStrategyMap[roi.action.type],
  );
  if (normalizedBox.height !== 0 && normalizedBox.width !== 0) {
    Object.assign<CommittedRoiProperties, CommittedBox>(
      committedRoi,
      normalizedBox,
    );
  }
  roi.box = denormalizeBox(committedRoi);
}
