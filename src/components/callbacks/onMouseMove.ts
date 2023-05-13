import { Actions, DragObject, DragState } from '../../context/DragContext';
import { EventActions, EventStateType } from '../../context/EventReducer';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseMove(
  event: React.MouseEvent,
  rect: { offsetLeft: number; offsetTop: number },
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState } = componentState;
  const { isMouseDown, setChangeState, object } = eventState;

  if (isMouseDown) {
    if (setChangeState.drag) {
      const { delta } = eventState;
      const object = componentState.contextState.objects.find(
        (obj) => obj.id === eventState.object
      ) as DragObject;
      const scaledRectangle = getScaledRectangle(object.rectangle, delta, rect);
      const initPoint = { x: event.clientX, y: event.clientY };
      const endPoint = {
        x: initPoint.x + scaledRectangle.width,
        y: initPoint.y + scaledRectangle.height,
      };

      eventDispatch({ type: 'setStartPosition', payload: initPoint });
      eventDispatch({ type: 'setCurrentPosition', payload: endPoint });
    } else if (setChangeState.resize) {
      eventDispatch({
        type: 'setCurrentPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    } else {
      eventDispatch({
        type: 'setCurrentPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    }
  }
}
