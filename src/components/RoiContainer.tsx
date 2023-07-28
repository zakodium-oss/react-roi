import { useContext } from 'react';
import { useKbsGlobal } from 'react-kbs';

import { RoiDispatchContext } from '../context/RoiContext';

import { ContainerComponent } from './ContainerComponent';

interface RoiComponentProps {
  children: JSX.Element[];
  target?: JSX.Element;
  options?: { containerWidth?: number; containerHeight?: number };
}

export function RoiContainer({
  children,
  target,
  options = {},
}: RoiComponentProps) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted) {
          roiDispatch({ type: 'removeRoi', payload: undefined });
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
