import { Roi } from '../../types/Roi';
import { assertUnreachable } from '../../utilities/assert';
import {
  applyInverseX,
  applyInverseY,
  computeTotalPanZoom,
} from '../../utilities/panZoom';
import { createRoi } from '../../utilities/rois';
import { ReactRoiState, StartDrawPayload } from '../roiReducer';

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
        action: {
          type: 'drawing',
          xAxisCorner: 'left',
          yAxisCorner: 'top',
          previousSelectedRoi: draft.selectedRoi,
        },

        x1: x,
        y1: y,
        x2: x,
        y2: y,

        data: undefined,
      };
      draft.selectedRoi = roi.id;
      draft.rois.push(roi);
      draft.action = 'drawing';
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
