import { CSSProperties, JSX, ReactNode } from 'react';

import { Actions, UpdateData } from '../../hooks/useActions';
import { usePanZoom } from '../../hooks/usePanZoom';
import { CommittedRoi } from '../../types/Roi';

import { ContainerComponent } from './ContainerComponent';

export interface RoiContainerProps<TData = unknown> {
  target: JSX.Element;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
  lockZoom?: boolean;
  lockPan?: boolean;
  /**
   * If true, the user won't be able to unselect the current ROI by clicking on the container
   */
  noUnselection?: boolean;
  /**
   * Get the data of a new ROI as it is being drawn.
   */
  getNewRoiData?: () => TData;
  /**
   * If enabled, the user will be able to zoom into the target just by using the mouse wheel
   * Discouraged in a scrollable container
   */
  zoomWithoutModifierKey?: boolean;
}

export type AfterDrawCallback<TData = unknown> = (
  roi: CommittedRoi<TData>,
  actions: Actions,
) => void;
export type AfterUpdateCallback<TData = unknown> = (
  selectedRoiId: string,
  roi: UpdateData<TData>,
  actions: Actions,
) => void;

export function RoiContainer<TData = unknown>(props: RoiContainerProps<TData>) {
  const {
    children,
    style,
    lockZoom = false,
    lockPan = false,
    ...otherProps
  } = props;

  const panZoom = usePanZoom();

  return (
    <ContainerComponent
      lockZoom={lockZoom}
      lockPan={lockPan}
      style={{
        ...style,
        visibility: panZoom.isReady ? 'visible' : 'hidden',
      }}
      {...otherProps}
    >
      {children}
    </ContainerComponent>
  );
}
