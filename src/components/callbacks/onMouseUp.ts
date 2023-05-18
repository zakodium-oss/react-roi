import {
  Actions,
  DataContextProps,
  DataState,
} from '../../context/DataContext';
import { DynamicAction, DynamicStateType } from '../../context/DynamicContext';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../../context/EventReducer';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import {
  PositionAction,
  PositionStateType,
} from '../../context/PositionContext';
import { DataObject } from '../../types/DataObject';
import { Point } from '../../types/Point';
import { checkRectangle } from '../../utilities/checkRectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseUp(
  event: React.MouseEvent,
  object: DataObject,
  rect: { offsetLeft: number; offsetTop: number },
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
  positionState: PositionStateType,
  positionDispatch: React.Dispatch<PositionAction>,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const { startPoint, endPoint, delta } = positionState;
  switch (dynamicState.action) {
    case DrawActions.DRAG:
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
        object.rectangle = getRectangle(
          getRectangleFromPoints(startPoint, endPoint),
          delta,
          rect
        );
      }
      dynamicDispatch({
        type: 'setAction',
        payload: DrawActions.SLEEP,
      });
      break;
    case DrawActions.DRAW:
      if (
        checkRectangle(
          startPoint,
          { x: event.clientX, y: event.clientY },
          delta,
          rect
        )
      ) {
        objectDispatch({
          type: 'addObject',
          payload: {
            id: Math.random(),
            selected: false,
            rectangle: getRectangle(
              getRectangleFromPoints(startPoint, endPoint),
              delta,
              rect
            ),
          },
        });
      }
      break;

    case DrawActions.RESIZE:
      object.rectangle = getRectangle(
        getRectangleFromPoints(startPoint, endPoint),
        delta,
        rect
      );
      dynamicDispatch({
        type: 'setAction',
        payload: DrawActions.SLEEP,
      });
      break;
  }
  object.selected = false;
  positionDispatch({ type: 'setStartPoint', payload: { x: 0, y: 0 } });
  positionDispatch({ type: 'setEndPoint', payload: { x: 0, y: 0 } });
  dynamicDispatch({ type: 'setIsMouseDown', payload: false });
  dynamicDispatch({
    type: 'setAction',
    payload: DrawActions.SLEEP,
  });
}
