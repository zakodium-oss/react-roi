import { Actions, DragState } from '../../context/DragContext';
import { EventActions, EventStateType } from '../../context/EventReducer';

export function onMouseUpOutside(componentState: {
  contextState: DragState;
  contextDispatch: React.Dispatch<Actions>;
  eventState: EventStateType;
  eventDispatch: React.Dispatch<EventActions>;
}) {
  const { eventDispatch } = componentState;
  eventDispatch({ type: 'setIsMouseDown', payload: false });
  // TODO: Find out how to handle events outside of boundaries
  // const x =
  //   event.clientX > width / delta.width ? width / delta.width : event.clientX;
  // const y =
  //   event.clientY > height / delta.height
  //     ? height / delta.height
  //     : event.clientY;
}
