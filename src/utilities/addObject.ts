import { DynamicStateType } from '../types/DynamicStateType';
import { Point } from '../types/Point';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function addObject(draft: DynamicStateType, id: string) {
  const { startPoint, endPoint, ratio } = draft;
  draft.objects.push({
    id,
    rectangle: getRectangle(
      getRectangleFromPoints(startPoint as Point, endPoint as Point),
      ratio,
    ),
  });
  draft.objectID = id;
}
