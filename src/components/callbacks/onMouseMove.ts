import { Actions, DataObject, DataState } from '../../context/DataContext';
import { EventActions, EventStateType } from '../../context/EventReducer';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseMove(
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
  const { eventDispatch, eventState } = componentState;
  const { isMouseDown, dynamicState } = eventState;
  if (isMouseDown) {
    if (dynamicState.drag) {
      const { delta } = eventState;
      const scaledRectangle = getScaledRectangle(object.rectangle, delta, rect);
      const position = dragRectangle(scaledRectangle, event);
      eventDispatch({ type: 'setStartPoint', payload: position.startPoint });
      eventDispatch({ type: 'setCurrentPoint', payload: position.endPoint });
    } else if (dynamicState.resize) {
      eventDispatch({
        type: 'setCurrentPoint',
        payload: { x: event.clientX, y: event.clientY },
      });
    } else {
      eventDispatch({
        type: 'setCurrentPoint',
        payload: { x: event.clientX, y: event.clientY },
      });
    }
  }
}
