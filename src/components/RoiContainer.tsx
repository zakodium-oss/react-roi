import { useContext } from 'react';
import { useKbsGlobal } from 'react-kbs';

import { RoiDispatchContext } from '../context/RoiContext';

import { ContainerComponent } from './ContainerComponent';

interface RoiComponentProps {
  target?: JSX.Element;
  children?: JSX.Element;
  options?: { containerWidth?: number; containerHeight?: number };
}

export function RoiContainer({
  target,
  children,
  options = {},
}: RoiComponentProps) {
  const roiDispatch = useContext(RoiDispatchContext);
  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted) {
          roiDispatch({ type: 'removeRoi', payload: undefined });
        }
      },
    },
    {
      shortcut: ['Escape'],
      handler: (event) => {
        event.preventDefault();
        if (event.isTrusted) {
          roiDispatch({
            type: 'cancelDrawing',
            payload: event as React.KeyboardEvent,
          });
        }
      },
    },
  ]);
  return (
    <ContainerComponent target={target} options={options}>
      {children}
    </ContainerComponent>
  );
}
