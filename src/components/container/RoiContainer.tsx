import { CSSProperties, JSX, ReactNode } from 'react';

import { UpdateData } from '../../hooks/useActions';
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
   * Called right before the ROI has finished being drawn.
   If specified, it becomes responsible for creating the ROI based on the data provided in the arguments.
   * @param roi The ROI that was just drawn. The position and size are already normalized and bounded to the target size.
   */
  onDrawFinish?: OnFinishDrawCallback<TData>;
  /**
   * Called right before the ROI has finished moving.
   * If specified, it becomes responsible for updating the ROI based on the data provided in the arguments.
   * @param roi The ROI that was just moved. The position and size are already normalized and bounded to the target size.
   * @returns true if the creation of the ROI should be cancelled, false otherwise.
   */
  onMoveFinish?: OnFinishUpdateCallback<TData>;
  /**
   * Called right before the ROI has finished resizing.
   * If specified, it becomes responsible for updating the ROI based on the data provided in the arguments.
   * @param roi The ROI that was just resized. The position and size are already normalized and bounded to the target size.
   * @returns true if the creation of the ROI should be cancelled, false otherwise.
   */
  onResizeFinish?: OnFinishUpdateCallback<TData>;
  /**
   * Get the data of a new ROI as it is being drawn.
   */
  getNewRoiData?: () => TData;
}

export type OnFinishDrawCallback<TData = unknown> = (
  roi: CommittedRoi<TData>,
) => void;
export type OnFinishUpdateCallback<TData = unknown> = (
  selectedRoiId: string,
  roi: UpdateData<TData>,
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
