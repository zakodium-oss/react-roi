import { CSSProperties, JSX, ReactNode } from 'react';

import { Actions } from '../../hooks/useActions';
import { usePanZoom } from '../../hooks/usePanZoom';
import { CommittedRoi, CommittedRoiProperties } from '../../types/CommittedRoi';

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
 * Hook which gets called after a user has drawn a new ROI, just before it is committed.
 * This hook is not called if a new ROI is created through the actions API.
 */
export type AfterDrawCallback<TData = unknown> = (
  /**
   * The ROI which just got drawn through user interaction, before it is committed.
   */
  roi: CommittedRoi<TData>,
  /**
   * The actions API to manipulate the state of react-roi, same as the one
   * returned by the `useActions` hook.
   */
  actions: Actions<TData>,
  /**
   * All committed ROIs, before the new one is added.
   */
  roisBeforeDraw: Array<CommittedRoiProperties<TData>>,
) => void;

/**
 * Hook which gets called after a user has updated an existing ROI (move, resize, rotate), just before it is committed.
 * This hook is not called if an existing ROI is updated through the actions API.
 */
export type AfterUpdateCallback<TData = unknown> = (
  /**
   * The new ROI which just got updated through user interaction, before it is committed.
   */
  updatedRoi: CommittedRoiProperties<TData>,
  /**
   * The actions API to manipulate the state of react-roi, same as the one
   * returned by the `useActions` hook.
   */
  actions: Actions<TData>,
  /**
   * All committed ROIs, before the update is applied.
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
