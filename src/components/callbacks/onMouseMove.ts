import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectStateType } from '../../context/ObjectContext';
import { DataObject } from '../../types/DataObject';
import { Offset } from '../../types/Offset';
import { Ratio } from '../../types/Ratio';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseMove(
  event: React.MouseEvent,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>,
  objectState: ObjectStateType
) {
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  ) as DataObject;
  const mousePosition = getMousePosition(event, dynamicState);
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(
        object.rectangle,
        dynamicState.ratio as Ratio,
        dynamicState.offset as Offset
      );
      const position = dragRectangle(
        scaledRectangle,
        mousePosition,
        dynamicState.delta || { dx: 0, dy: 0 }
      );
      dynamicDispatch({ type: 'setPosition', payload: position });
      break;
    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      dynamicDispatch({ type: 'setEndPoint', payload: mousePosition });
      break;
  }
}

function getMousePosition(
  event: React.MouseEvent,
  dynamicState: DynamicStateType
): { x: number; y: number } {
  switch (dynamicState.pointerIndex) {
    case 4:
    case 5:
      return { x: dynamicState.endPoint?.x || 0, y: event.clientY };
    case 6:
    case 7:
      return { x: event.clientX || 0, y: dynamicState.endPoint?.y || 0 };
    default:
      return { x: event.clientX, y: event.clientY };
  }
}
