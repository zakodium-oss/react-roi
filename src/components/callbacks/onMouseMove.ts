import { Actions, DataObject, DataState } from '../../context/DataContext';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../../context/EventReducer';
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
    switch (dynamicState.action) {
      case DrawActions.DRAG:
        console.log(dynamicState.action);
        const { delta } = eventState;
        const scaledRectangle = getScaledRectangle(
          object.rectangle,
          delta,
          rect
        );
        const position = dragRectangle(
          scaledRectangle,
          event,
          dynamicState.delta || { dx: 0, dy: 0 }
        );
        eventDispatch({ type: 'setStartPoint', payload: position.startPoint });
        eventDispatch({ type: 'setCurrentPoint', payload: position.endPoint });
        break;
      case DrawActions.DRAW:
      case DrawActions.RESIZE:
        eventDispatch({
          type: 'setCurrentPoint',
          payload: { x: event.clientX, y: event.clientY },
        });
        break;
    }
  }
}
