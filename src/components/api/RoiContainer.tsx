import { useKbsGlobal } from 'react-kbs';

import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { ContainerComponent } from '../ContainerComponent';

interface RoiComponentProps {
  target?: JSX.Element;
  children?: JSX.Element;
}

export function RoiContainer({ target, children }: RoiComponentProps) {
  const roiDispatch = useRoiDispatch();
  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted) {
          roiDispatch({ type: 'REMOVE_ROI', payload: undefined });
        }
      },
    },
    {
      shortcut: ['Escape'],
      handler: (event) => {
        event.preventDefault();
        if (event.isTrusted) {
          roiDispatch({
            type: 'CANCEL_ACTION',
            payload: event as React.KeyboardEvent,
          });
        }
      },
    },
  ]);
  return <ContainerComponent target={target}>{children}</ContainerComponent>;
}
