import { Rectangle } from '../types/Rectangle';

export function BoxAnnotation({
  rectangle,
  options,
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
      x={origin.column}
      y={origin.row}
      width={width}
      height={height}
      style={{ ...defaultOptions, ...options }}
    ></rect>
  );
}
