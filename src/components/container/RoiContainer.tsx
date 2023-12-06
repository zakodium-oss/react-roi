import useResizeObserver from '@react-hook/resize-observer';
import { CSSProperties, ReactNode } from 'react';

import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';

import { ContainerComponent } from './ContainerComponent';

interface RoiComponentProps {
  target?: JSX.Element;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
  targetRef?: React.MutableRefObject<undefined>;
}

export function RoiContainer({
  target,
  targetRef,
  children,
  style,
  className,
  id,
}: RoiComponentProps) {
  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  useResizeObserver(targetRef, (data) => {
    roiDispatch({
      type: 'SET_SIZE',
      payload: {
        width: data.contentRect.width,
        height: data.contentRect.height,
      },
    });
  });

  return (
    <ContainerComponent
      id={id}
      target={target}
      style={{
        ...style,
        visibility: panZoom.isReady ? 'visible' : 'hidden',
      }}
      className={className}
    >
      {children}
    </ContainerComponent>
  );
}
