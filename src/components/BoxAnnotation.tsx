import { Rectangle } from "../types/Rectangle";

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
  };
}) {
  const defaultOptions = {
    strokeWidth: 4,
    stroke: "black",
    fill: "black",
    strokeDasharray: 0,
    strokeDashoffset: 0,
  };
  const { height, width, origin } = rectangle;
  return (
    <g>
      <rect
        x={origin.column}
        y={origin.row}
        width={width}
        height={height}
        style={{ ...defaultOptions, ...options }}
      ></rect>
    </g>
  );
}
