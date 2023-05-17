import { Actions, DataObject, DataState } from '../../context/DataContext';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../../context/EventReducer';
import { Point } from '../../types/Point';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseUp(
  event: React.MouseEvent,
  object: DataObject,
  rect: { offsetLeft: number; offsetTop: number },
  componentState: {
    contextState: DataState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState, contextDispatch } = componentState;
  const { startPoint, currentPoint, delta, dynamicState } = eventState;
  switch (eventState.dynamicState.action) {
    case DrawActions.DRAG:
      const scaledRectangle = getScaledRectangle(object.rectangle, delta, rect);
      const position = dragRectangle(
        scaledRectangle,
        event,
        dynamicState.delta || { dx: 0, dy: 0 }
      );
      if (checkRectangle(startPoint, currentPoint, delta, rect)) {
        eventDispatch({ type: 'setStartPoint', payload: position.startPoint });
        eventDispatch({ type: 'setCurrentPoint', payload: position.endPoint });
        object.rectangle = getRectangle(
          getRectangleFromPoints(startPoint, currentPoint),
          delta,
          rect
        );
      }
      eventDispatch({
        type: 'setDynamicState',
        payload: { action: DrawActions.SLEEP, position: 0 },
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
        contextDispatch({
          type: 'addObject',
          payload: {
            id: Math.random(),
            selected: false,
            rectangle: getRectangle(
              getRectangleFromPoints(startPoint, currentPoint),
              delta,
              rect
            ),
          },
        });
      }
      break;

    case DrawActions.RESIZE:
      object.rectangle = getRectangle(
        getRectangleFromPoints(startPoint, currentPoint),
        delta,
        rect
      );
      eventDispatch({
        type: 'setDynamicState',
        payload: { action: DrawActions.SLEEP, position: 0 },
      });
      break;
  }
  eventDispatch({ type: 'setStartPoint', payload: { x: 0, y: 0 } });
  eventDispatch({ type: 'setCurrentPoint', payload: { x: 0, y: 0 } });
  eventDispatch({ type: 'setIsMouseDown', payload: false });
  eventDispatch({
    type: 'setDynamicState',
    payload: { action: DrawActions.SLEEP, position: 0 },
  });
}

function checkRectangle(
  startPoint: Point,
  endPoint: Point,
  delta: { width: number; height: number },
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  options: { limit?: number } = {}
) {
  const { limit = 10 } = options;
  const rectangle = getRectangleFromPoints(startPoint, endPoint);
  const actualRectangle = getRectangle(rectangle, delta, rect);
  return actualRectangle.width > limit && actualRectangle.height > limit;
}
