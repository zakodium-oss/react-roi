import { Actions, DragState } from '../../context/DragContext';
import { EventActions, EventStateType } from '../../context/EventReducer';

export function onMouseDown(
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
  eventDispatch({ type: 'setIsMouseDown', payload: true });

  if (eventState.setChangeState.resize) {
    eventDispatch({
      type: 'setCurrentPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
  } else if (eventState.setChangeState.drag) {
    const initPoint = { x: event.clientX, y: event.clientY };
    eventDispatch({ type: 'setCurrentPosition', payload: initPoint });
  } else {
    const initPoint = { x: event.clientX, y: event.clientY };
    eventDispatch({ type: 'setStartPosition', payload: initPoint });
    eventDispatch({ type: 'setCurrentPosition', payload: initPoint });
  }
}
