import { Actions, DragObject, DragState } from '../../context/DragContext';
import { EventActions, EventStateType } from '../../context/EventReducer';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseUp(
  event: React.MouseEvent,
  object: DragObject,
  rect: { offsetLeft: number; offsetTop: number },
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState, contextDispatch } = componentState;
  const { startPosition, currentPosition, delta, setChangeState } = eventState;

  if (setChangeState.resize) {
    object.rectangle = getRectangle(
      getRectangleFromPoints(startPosition, currentPosition),
      delta,
      rect
    );

    eventDispatch({
      type: 'setChangeState',
      payload: { resize: false, drag: false, position: 0 },
    });

    eventDispatch({
      type: 'setStartPosition',
      payload: { x: event.clientX, y: event.clientY },
    });

    eventDispatch({
      type: 'setCurrentPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
  } else if (setChangeState.drag) {
    const initPoint = { x: event.clientX, y: event.clientY };
    const scaledRectangle = getScaledRectangle(object.rectangle, delta, rect);
    const endPoint = {
      x: initPoint.x + scaledRectangle.width,
      y: initPoint.y + scaledRectangle.height,
    };

    if (
      Math.abs(startPosition.x - currentPosition.x) > 10 &&
      Math.abs(startPosition.y - currentPosition.y) > 10
    ) {
      eventDispatch({ type: 'setStartPosition', payload: initPoint });
      eventDispatch({ type: 'setCurrentPosition', payload: endPoint });
      object.rectangle = getRectangle(
        getRectangleFromPoints(startPosition, currentPosition),
        delta,
        rect
      );
    }
    eventDispatch({
      type: 'setChangeState',
      payload: { resize: false, drag: false, position: 0 },
    });
  } else {
    if (
      Math.abs(event.clientX - startPosition.x) > 10 &&
      Math.abs(event.clientY - startPosition.y) > 10
    ) {
      contextDispatch({
        type: 'addObject',
        payload: {
          id: Math.random(),
          selected: false,
          rectangle: getRectangle(
            getRectangleFromPoints(startPosition, currentPosition),
            delta,
            rect
          ),
        },
      });

      eventDispatch({
        type: 'setStartPosition',
        payload: { x: event.clientX, y: event.clientY },
      });

      eventDispatch({
        type: 'setCurrentPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    }
  }
  eventDispatch({ type: 'setIsMouseDown', payload: false });
}
