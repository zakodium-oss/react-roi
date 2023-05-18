import { DynamicAction, DynamicStateType } from '../../context/DynamicContext';
import { DrawActions } from '../../context/EventReducer';
import {
  PositionAction,
  PositionStateType,
} from '../../context/PositionContext';
import { DataObject } from '../../types/DataObject';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseMove(
  event: React.MouseEvent,
  object: DataObject,
  rect: { offsetLeft: number; offsetTop: number },
  positionState: PositionStateType,
  dynamicState: DynamicStateType,
  positionDispatch: React.Dispatch<PositionAction>
) {
  if (dynamicState.isMouseDown) {
    switch (dynamicState.action) {
      case DrawActions.DRAG:
        const scaledRectangle = getScaledRectangle(
          object.rectangle,
          positionState.delta,
          rect
        );
        const position = dragRectangle(
          scaledRectangle,
          event,
          dynamicState.delta || { dx: 0, dy: 0 }
        );
        positionDispatch({
          type: 'setStartPoint',
          payload: position.startPoint,
        });
        positionDispatch({ type: 'setEndPoint', payload: position.endPoint });
        break;
      case DrawActions.DRAW:
      case DrawActions.RESIZE:
        positionDispatch({
          type: 'setEndPoint',
          payload: { x: event.clientX, y: event.clientY },
        });
        break;
    }
  }
}
