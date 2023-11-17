import { Roi } from '../../types/Roi';
import {
  applyInverseX,
  applyInverseY,
  computeTotalPanZoom,
} from '../../utilities/panZoom';
import { createRoi } from '../../utilities/rois';
import { ReactRoiState, StartDrawPayload } from '../roiReducer';

export function startDraw(draft: ReactRoiState, payload: StartDrawPayload) {
  const { event, containerBoundingRect } = payload;
  const emptyRoi = createRoi(crypto.randomUUID(), draft.targetSize);

  if (payload.isPanZooming) {
    draft.action = 'panning';
    return;
  }
  switch (draft.mode) {
    case 'draw': {
      const totalPanZoom = computeTotalPanZoom(draft);
      const x = applyInverseX(
        totalPanZoom,
        event.clientX - containerBoundingRect.x,
      );
      const y = applyInverseY(
        totalPanZoom,
        event.clientY - containerBoundingRect.y,
      );

      const roi: Roi = {
        ...emptyRoi,
        action: {
          type: 'drawing',
          xAxisCorner: 'left',
          yAxisCorner: 'top',
        },

        x,
        y,
        width: 0,
        height: 0,

        data: undefined,
      };
      draft.selectedRoi = roi.id;
      draft.rois.push(roi);
      draft.action = 'drawing';
      break;
    }
    case 'select': {
      draft.selectedRoi = undefined;
      break;
    }
    default:
      break;
  }
}
