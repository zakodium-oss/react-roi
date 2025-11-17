import type { Roi } from '../../types/Roi.js';
import { assertUnreachable } from '../../utilities/assert.js';
import {
  applyInverseX,
  applyInverseY,
  computeTotalPanZoom,
} from '../../utilities/panZoom.js';
import { createRoi } from '../../utilities/rois.js';
import type { ReactRoiState, StartDrawPayload } from '../roiReducer.js';

import { prepareSelectedBoxForAction } from './selectBoxAndStartAction.ts';

/**
 * The draw action is executed when the user starts interacting with the container
 */
export function startDraw(draft: ReactRoiState, payload: StartDrawPayload) {
  const { event, containerBoundingRect, noUnselection, lockPan } = payload;
  const emptyRoi = createRoi(crypto.randomUUID());

  if (payload.isPanZooming && !lockPan) {
    draft.action = 'panning';
    return;
  }
  const totalPanZoom = computeTotalPanZoom(draft);
  const x = applyInverseX(
    totalPanZoom,
    event.clientX - containerBoundingRect.x,
  );
  const y = applyInverseY(
    totalPanZoom,
    event.clientY - containerBoundingRect.y,
  );

  switch (draft.mode) {
    case 'hybrid':
    case 'draw': {
      const roi: Roi = {
        ...emptyRoi,
        data: payload.data,
        action: {
          type: 'drawing',
          xAxisCorner: 'left',
          yAxisCorner: 'top',
          previousSelectedRoi: draft.selectedRoi,
          remainder: {
            x: 0,
            y: 0,
          },
        },
        box: {
          xRotationCenter: 'left',
          yRotationCenter: 'top',
          x,
          y,
          width: 0,
          height: 0,
          angle: 0,
        },
      };
      draft.selectedRoi = roi.id;
      draft.rois.push(roi);
      draft.action = 'drawing';
      break;
    }
    case 'rotate_selected': {
      prepareSelectedBoxForAction(draft, { type: 'rotating_free' });
      break;
    }
    case 'select': {
      if (!noUnselection) {
        draft.selectedRoi = undefined;
      }

      if (!lockPan) {
        draft.action = 'panning';
      }
      break;
    }
    default:
      assertUnreachable(draft.mode);
  }
}
