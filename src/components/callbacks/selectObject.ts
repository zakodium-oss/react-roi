import { Actions, DataObject, DataState } from '../../context/DataContext';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../../context/EventReducer';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  object: DataObject,
  event: React.MouseEvent,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  componentState: {
    contextState: DataState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventState, eventDispatch } = componentState;
  const scaledRectangle = getScaledRectangle(
    object.rectangle,
    eventState.delta,
    rect
  );
  const dx = event.clientX - scaledRectangle.origin.column;
  const dy = event.clientY - scaledRectangle.origin.row;
  eventDispatch({
    type: 'setDynamicState',
    payload: {
      action: DrawActions.DRAG,
      point: {
        x: event.clientX,
        y: event.clientY,
      },
      delta: {
        dx,
        dy,
      },
    },
  });

  eventDispatch({
    type: 'setObject',
    payload: object,
  });
}
