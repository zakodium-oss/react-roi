import { CSSProperties, JSX, ReactNode } from 'react';

import { Actions } from '../../hooks/useActions';
import { usePanZoom } from '../../hooks/usePanZoom';
import { CommittedRoiProperties } from '../../types/CommittedRoi';

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

/**
 * Hook which gets called after a user has updated (move, resize, rotate) or created an  ROI, before it is committed.
 * This hook is not called if an existing ROI is created or updated through the actions API.
 */
export type OnChangeCallback<TData = unknown> = (
  /**
   * The new ROI which just got updated / created through user interaction, before it is committed.
   */
  updatedRoi: CommittedRoiProperties<TData>,
  /**
   * The actions API to manipulate the state of react-roi, same as the one
   * returned by the `useActions` hook.
   */
  actions: Actions<TData>,
  /**
   * All committed ROIs, before the update / creation is applied.
   */
  roisBeforeUpdate: Array<CommittedRoiProperties<TData>>,
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
