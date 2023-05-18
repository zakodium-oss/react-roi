import { DynamicAction, DynamicActions } from '../context/DynamicContext';
import { PositionAction } from '../context/PositionContext';
import { DataObject } from '../types/DataObject';
import { Rectangle } from '../types/Rectangle';

export function BoxAnnotation({
  object,
  rectangle,
  options,
  positionDispatch,
  dynamicDispatch,
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
  positionDispatch?: React.Dispatch<PositionAction>;
  dynamicDispatch?: React.Dispatch<DynamicAction>;
  onMouseDown?: (event: any) => void;
  onMouseUp?: (event: any) => void;
  onClick?: (event: any) => void;
}) {
  const defaultOptions = {
    strokeWidth: object.selected ? 3 : 1,
    stroke: 'black',
    fill: object.selected ? 'rgba(0,0,0,0.4)' : 'black',
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
        if (positionDispatch === undefined || dynamicDispatch === undefined)
          return;
        positionDispatch({ type: 'setObject', payload: object });
        dynamicDispatch({
          type: 'setAction',
          payload: DynamicActions.DRAG,
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
