import { DynamicStateType } from '../types/DynamicStateType';
import { Point } from '../types/Point';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function updateObject(draft: DynamicStateType) {
  const { startPoint, endPoint, ratio, objects, objectID } = draft;
  const object = objects.find((obj) => obj.id === objectID);
  if (object) {
    object.rectangle = getRectangle(
      getRectangleFromPoints(startPoint as Point, endPoint as Point),
      ratio,
    );
    return object.id;
  }
}
