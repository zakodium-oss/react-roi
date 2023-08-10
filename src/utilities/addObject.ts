import { RoiContainerState } from '../types/RoiContainerState';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function addObject(draft: RoiContainerState, id: string) {
  const { startPoint, endPoint, ratio } = draft;
  const rectangle = getRectangle(
    getRectangleFromPoints(startPoint, endPoint),
    ratio,
  );
  draft.rois.push({
    id,
    x: rectangle.x,
    y: rectangle.y,
    width: rectangle.width,
    height: rectangle.height,
    isMoving: false,
    isResizing: false,
    style: {
      backgroundColor: 'black',
      opacity: 1,
    },
    editStyle: {
      backgroundColor: 'black',
      opacity: 0.5,
    },
  });
  draft.selectedRoi = draft.rois[draft.rois.length - 1].id;
}
