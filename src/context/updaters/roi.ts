import type { Draft } from 'immer';

import type {
  BoundaryStrategy,
  CommittedBox,
  CommittedRoiProperties,
  Size,
} from '../../index.js';
import type { Roi } from '../../types/Roi.js';
import { assertUnreachable } from '../../utilities/assert.ts';
import type { BoundaryUpdateStrategy } from '../../utilities/boundary.ts';
import { getBoundaryStrategyFromAction } from '../../utilities/boundary.ts';
import {
  commitBox,
  denormalizeBox,
  normalizeBox,
} from '../../utilities/box.js';
import { getMBRBoundaries } from '../../utilities/rotate.js';
import type { CommitBoxStrategy, ReactRoiState } from '../roiReducer.js';

export function boundBox(
  committedBox: CommittedBox,
  targetSize: Size,
  /**
   * Strategy to bound the ROI box. If `move`, the ROI box will be moved so that it fits inside the target.
   * If `resize`, the ROI box will be resized so that it fits inside the target.
   */
  strategy: BoundaryUpdateStrategy,
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

  switch (strategy) {
    case 'resize_inside': {
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
      break;
    }
    case 'move_inside': {
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
      break;
    }
    case 'is_partially_inside': {
      const mbr = getMBRBoundaries(committedBox);
      // The separating axis theorem says that if any of the projections of 2 convex shapes do not overlap, then the shapes do not overlap.
      if (
        mbr.maxX < 0 ||
        mbr.minX > targetSize.width ||
        mbr.maxY < 0 ||
        mbr.minY > targetSize.height
      ) {
        // Throwing an error here will cancel the operation
        throw new Error('ROI is completely outside of target boundaries');
      }
      break;
    }
    case 'is_inside': {
      const mbr = getMBRBoundaries(committedBox);
      if (
        mbr.minX < 0 ||
        mbr.maxX > targetSize.width ||
        mbr.minY < 0 ||
        mbr.maxY > targetSize.height
      ) {
        // Throwing an error here will cancel the operation
        throw new Error('ROI is partially outside of target boundaries');
      }
      break;
    }
    default: {
      assertUnreachable(strategy);
    }
  }
  return result;
}

export function updateCommittedRoiPosition(
  draft: ReactRoiState,
  committedRoi: Draft<CommittedRoiProperties>,
  roi: Draft<Roi>,
  strategies?: {
    boxStrategy?: CommitBoxStrategy;
    boundaryStrategy?: BoundaryStrategy;
  },
) {
  const strategy = getBoundaryStrategyFromAction(
    roi,
    strategies?.boundaryStrategy ?? draft.commitRoiBoundaryStrategy,
  );
  const normalizedBox = boundBox(
    commitBox(
      normalizeBox(roi.box),
      roi.action,
      strategies?.boxStrategy ?? draft.commitRoiBoxStrategy,
    ),
    draft.targetSize,
    strategy,
  );
  if (normalizedBox.height !== 0 && normalizedBox.width !== 0) {
    Object.assign<CommittedRoiProperties, CommittedBox>(
      committedRoi,
      normalizedBox,
    );
  }
  roi.box = denormalizeBox(committedRoi);
}
