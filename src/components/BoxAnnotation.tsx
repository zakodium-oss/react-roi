import { EventActions } from '../context/EventReducer';
import { Rectangle } from '../types/Rectangle';

export function BoxAnnotation({
  id,
  rectangle,
  options,
  callback,
  onMouseDown,
}: {
  id: string | number;
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
  onMouseDown?: (event: any) => void;
}) {
  const defaultOptions = {
    strokeWidth: 4,
    stroke: 'black',
    fill: 'black',
    strokeDasharray: 0,
    strokeDashoffset: 0,
  };
  const { height, width, origin } = rectangle;
  return (
    <rect
      onMouseDown={onMouseDown}
      onClick={() => callback && callback({ type: 'setObject', payload: id })}
      x={origin.column}
      y={origin.row}
      width={width}
      height={height}
      style={{ ...defaultOptions, ...options }}
    ></rect>
  );
}
