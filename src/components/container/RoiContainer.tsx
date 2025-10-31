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

interface CallbackParameterBase<TData = unknown> {
  /**
   * The actions API to manipulate the state of react-roi, same as the one
   * returned by the `useActions` hook.
   */
  actions: Actions<TData>;
  /**
   * The type of action leading to the callback being called.
   * - `drawing`: A new ROI is being drawn.
   * - `moving`: An existing ROI is being moved.
   * - `resizing`: An existing ROI is being resized.
   * - `rotating`: An existing ROI is being rotated.
   */
  actionType: 'drawing' | 'moving' | 'resizing' | 'rotating';
  /**
   * All committed ROIs, before the update / creation is applied.
   */
  roisBeforeCommit: Array<CommittedRoiProperties<TData>>;
}

export interface OnCommitCallbackParameter<TData = unknown>
  extends CallbackParameterBase<TData> {
  /**
   * The ROI which just got updated / created through user interaction, before it is committed.
   */
  roi: CommittedRoiProperties<TData>;
}

export interface OnChangeCallbackParameter<TData = unknown>
  extends CallbackParameterBase<TData> {
  /**
   * The new ROI which just got updated / created through user interaction
   * before it is committed. It can be null when drawing a new ROI which is
   * smaller than the minimum size, which results in the ROI not being committed.
   */
  roi: CommittedRoiProperties<TData> | null;
}

/**
 * Hook which gets called just before a user edition (draw new, move, resize, rotate) is committed.
 * This hook is not called if an existing ROI is created or updated through the actions API.
 */
export type OnCommitCallback<TData = unknown> = (
  param: OnCommitCallbackParameter<TData>,
) => void;

/**
 * Hook which gets called every time an ROI is changed by user interaction (draw new, move, resize, rotate).
 * This hook is not called if an existing ROI is created or updated through the actions API.
 */
export type OnChangeCallback<TData = unknown> = (
  param: OnChangeCallbackParameter<TData>,
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
