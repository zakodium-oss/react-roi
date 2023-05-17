import { Actions, DataState } from '../../context/DataContext';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../../context/EventReducer';

export function onMouseDown(
  event: React.MouseEvent,
  componentState: {
    contextState: DataState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState, contextState } = componentState;
  eventDispatch({ type: 'setIsMouseDown', payload: true });
  const initPoint = { x: event.clientX, y: event.clientY };
  if (eventState.dynamicState.action === DrawActions.SLEEP) {
    eventDispatch({
      type: 'setDynamicState',
      payload: { ...eventState.dynamicState, action: DrawActions.DRAW },
    });
  }
  switch (eventState.dynamicState.action) {
    case DrawActions.DRAG:
      eventDispatch({ type: 'setStartPoint', payload: initPoint });
      break;
    case DrawActions.SLEEP:
      eventDispatch({ type: 'setStartPoint', payload: initPoint });
      eventDispatch({ type: 'setCurrentPoint', payload: initPoint });
      break;
    case DrawActions.RESIZE:
      eventDispatch({
        type: 'setCurrentPoint',
        payload: initPoint,
      });
      break;
  }
}
