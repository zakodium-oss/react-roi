import { Roi } from '../../types/Roi';
import { normalizeClientPoint } from '../../utilities/coordinates';
import { createRoi } from '../../utilities/rois';
import { MouseEventPayload, ReactRoiState } from '../roiReducer';

export function onMouseDown(draft: ReactRoiState, payload: MouseEventPayload) {
  const { event, containerBoundingRect } = payload;
  const emptyRoi = createRoi(crypto.randomUUID(), draft.size);

  switch (draft.mode) {
    case 'draw': {
      const point = normalizeClientPoint(
        { x: event.clientX, y: event.clientY },
        containerBoundingRect,
      );
      const roi: Roi = {
        ...emptyRoi,
        action: {
          type: 'drawing',
          xAxisCorner: 'left',
          yAxisCorner: 'top',
        },

        x: point.x,
        y: point.y,
        width: 0,
        height: 0,

        // TODO: allow to set a default data
        data: undefined,
      };
      draft.selectedRoi = roi.id;
      draft.rois.push(roi);
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
