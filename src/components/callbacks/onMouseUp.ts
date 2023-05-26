import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import { DataObject } from '../../types/DataObject';
import { Offset } from '../../types/Offset';
import { Point } from '../../types/Point';
import { Ratio } from '../../types/Ratio';
import { checkRectangle } from '../../utilities/checkRectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseUp(
  event: React.MouseEvent,
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const { startPoint, endPoint, ratio } = dynamicState;
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  ) as DataObject;
  const mousePosition = { x: event.clientX, y: event.clientY };
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(
        object.rectangle,
        ratio as Ratio,
        dynamicState.offset as Offset
      );
      const position = dragRectangle(
        scaledRectangle,
        mousePosition,
        dynamicState.delta
      );
      if (
        checkRectangle(
          dynamicState.startPoint as Point,
          endPoint as Point,
          ratio as Ratio,
          dynamicState.offset as Offset
        )
      ) {
        dynamicDispatch({ type: 'setPosition', payload: position });
        objectDispatch({
          type: 'updateRectangle',
          payload: {
            id: object.id,
            rectangle: getRectangle(
              getRectangleFromPoints(startPoint as Point, endPoint as Point),
              ratio as Ratio,
              dynamicState.offset as Offset
            ),
          },
        });
      }
      dynamicDispatch({ type: 'setObjectID', payload: object.id as number });
      break;

    case DynamicActions.DRAW:
      if (
        checkRectangle(
          startPoint as Point,
          mousePosition,
          ratio as Ratio,
          dynamicState.offset as Offset
        )
      ) {
        const newID = Math.random();
        const object: DataObject = {
          id: newID,
          rectangle: getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio as Ratio,
            dynamicState.offset as Offset
          ),
        };
        dynamicDispatch({ type: 'setObjectID', payload: newID });
        objectDispatch({ type: 'addObject', payload: object });
      }
      break;

    case DynamicActions.RESIZE:
      objectDispatch({
        type: 'updateRectangle',
        payload: {
          id: object.id,
          rectangle: getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio as Ratio,
            dynamicState.offset as Offset
          ),
        },
      });
      dynamicDispatch({ type: 'setObjectID', payload: object.id as number });
      break;
  }
  dynamicDispatch({
    type: 'setPosition',
    payload: { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } },
  });
  dynamicDispatch({
    type: 'setAction',
    payload: DynamicActions.SLEEP,
  });
}
