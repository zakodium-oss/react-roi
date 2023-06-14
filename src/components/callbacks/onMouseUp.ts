import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';

export function onMouseUp(
  event: React.MouseEvent,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const object = dynamicState.getObject();
  const mousePosition = {
    x: event.clientX - (dynamicState.offset?.left as number),
    y: event.clientY - (dynamicState.offset?.top as number),
  };

  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      if (dynamicState.checkRectangle()) {
        dynamicDispatch({
          type: 'dragRectangle',
          payload: {
            point: mousePosition,
          },
        });
        dynamicDispatch({
          type: 'updateRectangle',
          payload: object.id as number,
        });
      }
      dynamicDispatch({ type: 'setObjectID', payload: object.id as number });
      break;

    case DynamicActions.DRAW:
      if (dynamicState.checkRectangle({ point: mousePosition })) {
        dynamicDispatch({ type: 'addObject', payload: Math.random() });
      } else {
        dynamicDispatch({ type: 'setObjectID', payload: undefined });
      }
      break;

    case DynamicActions.RESIZE:
      dynamicDispatch({
        type: 'updateRectangle',
        payload: object.id as number,
      });
      dynamicDispatch({
        type: 'setDynamicState',
        payload: {
          objectID: object.id as number,
          pointerIndex: undefined,
        },
      });
      break;
    case DynamicActions.SLEEP:
      break;
  }
  dynamicDispatch({
    type: 'setPosition',
    payload: { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } },
  });
  dynamicDispatch({
    type: 'setAction',
    payload: DynamicActions.SLEEP,
  });
}
