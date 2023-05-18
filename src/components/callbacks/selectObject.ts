import { DataContextProps } from '../../context/DataContext';
import { DynamicAction, DynamicStateType } from '../../context/DynamicContext';
import { DrawActions } from '../../context/EventReducer';
import { ObjectActions } from '../../context/ObjectContext';
import {
  PositionAction,
  PositionStateType,
} from '../../context/PositionContext';
import { DataObject } from '../../types/DataObject';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  object: DataObject,
  event: React.MouseEvent,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  positionState: PositionStateType,
  positionDispatch: React.Dispatch<PositionAction>,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const scaledRectangle = getScaledRectangle(
    object.rectangle,
    positionState.delta,
    rect
  );
  dynamicDispatch({
    type: 'setDynamicState',
    payload: {
      isMouseDown: true,
      action: DrawActions.DRAG,
      point: {
        x: event.clientX,
        y: event.clientY,
      },
      delta: {
        dx: event.clientX - scaledRectangle.origin.column,
        dy: event.clientY - scaledRectangle.origin.row,
      },
    },
  });

  object.selected = true;
  positionDispatch({
    type: 'setObject',
    payload: object,
  });
}
