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
  const object = objectState.objects.find((obj) => obj.selected) as DataObject;
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(
        object.rectangle,
        ratio as Ratio,
        dynamicState.offset as Offset
      );
      const position = dragRectangle(
        scaledRectangle,
        { x: event.clientX, y: event.clientY },
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
        dynamicDispatch({
          type: 'setStartPoint',
          payload: position.startPoint,
        });
        dynamicDispatch({
          type: 'setEndPoint',
          payload: position.endPoint,
        });
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
      objectDispatch({
        type: 'updateSelection',
        payload: { id: object.id, selected: true },
      });
      break;
    case DynamicActions.DRAW:
      const newID = Math.random();
      if (
        checkRectangle(
          startPoint as Point,
          { x: event.clientX, y: event.clientY },
          ratio as Ratio,
          dynamicState.offset as Offset
        )
      ) {
        const object: DataObject = {
          id: newID,
          selected: true,
          rectangle: getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio as Ratio,
            dynamicState.offset as Offset
          ),
        };
        objectDispatch({
          type: 'addObject',
          payload: object,
        });
      }
      objectDispatch({
        type: 'updateSelection',
        payload: { id: newID as number, selected: true },
      });
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
      objectDispatch({
        type: 'updateSelection',
        payload: { id: object.id, selected: true },
      });
      break;
  }

  dynamicDispatch({ type: 'setStartPoint', payload: { x: 0, y: 0 } });
  dynamicDispatch({ type: 'setEndPoint', payload: { x: 0, y: 0 } });
  dynamicDispatch({
    type: 'setAction',
    payload: DynamicActions.SLEEP,
  });
}
