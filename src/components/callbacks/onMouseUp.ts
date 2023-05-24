import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import {
  PositionAction,
  PositionStateType,
} from '../../context/PositionContext';
import { DataObject } from '../../types/DataObject';
import { checkRectangle } from '../../utilities/checkRectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseUp(
  event: React.MouseEvent,
  rect: { offsetLeft: number; offsetTop: number },
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
  positionState: PositionStateType,
  positionDispatch: React.Dispatch<PositionAction>,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const { startPoint, endPoint, delta } = positionState;
  const objectID = objectState.objects.find((obj) => obj.selected)?.id;
  const object = objectState.objects.find(
    (obj) => obj.id === objectID
  ) as DataObject;
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(object.rectangle, delta, rect);
      const position = dragRectangle(
        scaledRectangle,
        event,
        dynamicState.delta || { dx: 0, dy: 0 }
      );
      if (checkRectangle(positionState.startPoint, endPoint, delta, rect)) {
        positionDispatch({
          type: 'setStartPoint',
          payload: position.startPoint,
        });
        positionDispatch({
          type: 'setEndPoint',
          payload: position.endPoint,
        });
        objectDispatch({
          type: 'updateRectangle',
          payload: {
            id: objectID as number | string,
            rectangle: getRectangle(
              getRectangleFromPoints(startPoint, endPoint),
              delta,
              rect
            ),
          },
        });
      }
      objectDispatch({
        type: 'updateSelection',
        payload: { id: objectID as number, selected: true },
      });
      break;
    case DynamicActions.DRAW:
      const newID = Math.random();
      if (
        checkRectangle(
          startPoint,
          { x: event.clientX, y: event.clientY },
          delta,
          rect
        )
      ) {
        const object: DataObject = {
          id: newID,
          selected: true,
          rectangle: getRectangle(
            getRectangleFromPoints(startPoint, endPoint),
            delta,
            rect
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
          id: objectID as number | string,
          rectangle: getRectangle(
            getRectangleFromPoints(startPoint, endPoint),
            delta,
            rect
          ),
        },
      });
      objectDispatch({
        type: 'updateSelection',
        payload: { id: objectID as number | string, selected: true },
      });
      break;
  }

  positionDispatch({ type: 'setStartPoint', payload: { x: 0, y: 0 } });
  positionDispatch({ type: 'setEndPoint', payload: { x: 0, y: 0 } });
  dynamicDispatch({ type: 'setIsMouseDown', payload: false });
  dynamicDispatch({
    type: 'setAction',
    payload: DynamicActions.SLEEP,
  });
}
