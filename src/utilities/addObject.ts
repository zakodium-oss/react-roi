import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';
import { Ratio } from '../types/Ratio';
import { Point } from '../types/Point';
import { DynamicStateType } from '../types/DynamicStateType';

export function addObject(draft: DynamicStateType, id: string) {
  const { startPoint, endPoint, ratio } = draft;
  draft.objects.push({
    id,
    rectangle: getRectangle(
      getRectangleFromPoints(startPoint as Point, endPoint as Point),
      ratio as Ratio
    ),
  });
  draft.objectID = id;
}
