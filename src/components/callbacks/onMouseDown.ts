import { Actions, DataState } from '../../context/DataContext';
import { EventActions, EventStateType } from '../../context/EventReducer';

export function onMouseDown(
  event: React.MouseEvent,
  rect: { offsetLeft: number; offsetTop: number },
  componentState: {
    contextState: DataState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState } = componentState;
  eventDispatch({ type: 'setIsMouseDown', payload: true });
  if (eventState.dynamicState.resize) {
    eventDispatch({
      type: 'setCurrentPoint',
      payload: { x: event.clientX, y: event.clientY },
    });
  } else if (eventState.dynamicState.drag) {
    const initPoint = { x: event.clientX, y: event.clientY };
    eventDispatch({ type: 'setStartPoint', payload: initPoint });
  } else {
    const initPoint = { x: event.clientX, y: event.clientY };
    eventDispatch({ type: 'setStartPoint', payload: initPoint });
    eventDispatch({ type: 'setCurrentPoint', payload: initPoint });
  }
}
