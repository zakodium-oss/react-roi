import { Actions, DragState } from '../../context/DragContext';
import { EventActions, EventStateType } from '../../context/EventReducer';

export function dragObject(
  event: React.MouseEvent,
  id: string | number,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch } = componentState;
  eventDispatch({
    type: 'setChangeState',
    payload: {
      drag: true,
      resize: false,
      delta: {
        dx: event.clientX - rect.offsetLeft,
        dy: event.clientY - rect.offsetTop,
        x: event.clientX,
        y: event.clientY,
      },
    },
  });

  eventDispatch({
    type: 'setObject',
    payload: id,
  });
}
