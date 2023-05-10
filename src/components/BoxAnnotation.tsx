import { Rectangle } from '../types/Rectangle';

export function BoxAnnotation({
  rectangle,
  options,
  callback,
}: {
  rectangle: Rectangle;
  options?: {
    strokeWidth?: number | string;
    stroke?: string;
    fill?: string;
    strokeDasharray?: number | string;
    strokeDashoffset?: number | string;
    zIndex?: number | undefined;
  };
  callback?: React.Dispatch<Rectangle>;
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
      // onClick={() => callback && callback(rectangle) }
      onClick={() => {
        console.log(rectangle);
        console.log(callback);
        if (!callback) return;
        callback(rectangle);
        console.log('passed', rectangle);
      }}
      x={origin.column}
      y={origin.row}
      width={width}
      height={height}
      style={{ ...defaultOptions, ...options }}
    ></rect>
  );
}
