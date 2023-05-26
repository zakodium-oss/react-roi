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
  const mousePosition = { x: event.clientX, y: event.clientY };
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
      dynamicDispatch({
        type: 'setEndPoint',
        payload: mousePosition,
      });
      break;
  }
}
