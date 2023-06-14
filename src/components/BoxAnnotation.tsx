import { useContext } from 'react';
import { DynamicContext } from '../context/DynamicContext';
import { Rectangle } from '../types/Rectangle';
import { useKbsGlobal } from 'react-kbs';

type BoxAnnotationProps = {
  id: number | string | undefined;
  rectangle: Rectangle;
  options?: BoxAnnotationOptions;
};

export function BoxAnnotation({
  id,
  rectangle,
  options,
}: BoxAnnotationProps): JSX.Element {
  const defaultOptions = {
    strokeWidth: 1,
    stroke: 'black',
    fill: 'rgba(0,0,0,0.8)',
    strokeDasharray: 0,
    strokeDashoffset: 0,
  };
  const { dynamicDispatch } = useContext(DynamicContext);
  const { height, width, origin } = rectangle;
  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted) {
          dynamicDispatch({ type: 'removeObject', payload: id as number });
        }
      },
    },
  ]);

  return (
    <rect
      onMouseDownCapture={(event) => {
        dynamicDispatch({
          type: 'selectBoxAnnotation',
          payload: { id: id as number, event: event },
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

type BoxAnnotationOptions = {
  strokeWidth?: number | string;
  stroke?: string;
  fill?: string;
  strokeDasharray?: number | string;
  strokeDashoffset?: number | string;
  zIndex?: number | undefined;
};
