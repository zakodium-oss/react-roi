import { DataObject } from '../context/DataContext';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../context/EventReducer';
import { Rectangle } from '../types/Rectangle';

export function BoxAnnotation({
  object,
  rectangle,
  options,
  callback,
  state,
  onMouseDown,
  onMouseUp,
  onClick,
}: {
  object: DataObject;
  rectangle: Rectangle;
  options?: {
    strokeWidth?: number | string;
    stroke?: string;
    fill?: string;
    strokeDasharray?: number | string;
    strokeDashoffset?: number | string;
    zIndex?: number | undefined;
  };
  callback?: React.Dispatch<EventActions>;
  state: EventStateType;
  onMouseDown?: (event: any) => void;
  onMouseUp?: (event: any) => void;
  onClick?: (event: any) => void;
}) {
  const defaultOptions = {
    strokeWidth: 1,
    stroke: 'black',
    fill: 'black',
    strokeDasharray: 0,
    strokeDashoffset: 0,
  };
  const { height, width, origin } = rectangle;
  return (
    <rect
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClickCapture={onClick}
      onMouseDownCapture={() => {
        console.log(callback !== undefined, callback);
        if (callback === undefined) return;
        console.log('it pass!');
        callback({ type: 'setObject', payload: object });
        callback({
          type: 'setDynamicState',
          payload: { ...state.dynamicState, action: DrawActions.DRAG },
        });
      }}
      x={origin.column}
      y={origin.row}
      width={width}
      height={height}
      style={{ ...defaultOptions, ...options }}
    ></rect>
  );
}
