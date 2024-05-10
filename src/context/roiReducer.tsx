import { produce } from 'immer';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { PanZoom, ReactRoiAction, ResizeStrategy, RoiMode, Size } from '..';
import { CommittedRoiProperties } from '../types/CommittedRoi';
import { Roi, XCornerPosition, YCornerPosition } from '../types/Roi';
import { assert, assertUnreachable } from '../utilities/assert';
import {
  changeBoxRotationCenter,
  xAxisCornerToCenter,
  yAxisCornerToCenter,
} from '../utilities/box';
import {
  createCommittedRoi,
  createRoi,
  createRoiFromCommittedRoi,
} from '../utilities/rois';

import { cancelAction } from './updaters/cancelAction';
import { endAction } from './updaters/endAction';
import { updateInitialPanZoom } from './updaters/initialPanZoom';
import { pointerMove } from './updaters/pointerMove';
import { sanitizeRois } from './updaters/sanitizeRois';
import { selectBoxAndStartAction } from './updaters/selectBoxAndStartAction';
import { startDraw } from './updaters/startDraw';
import { startPan } from './updaters/startPan';
import { resetZoomAction, zoomAction } from './updaters/zoom';

interface ZoomDomain {
  min: number;
  max: number;
  spaceAroundTarget: number;
}
export type CommitBoxStrategy = 'exact' | 'round';

export interface ReactRoiState<TData = unknown> {
  /**
   * Current mode
   */
  mode: RoiMode;

  /**
   * Resize strategy
   */
  resizeStrategy: ResizeStrategy;

  /**
   * How box properties of the roi should be updated when committed.
   */
  commitRoiBoxStrategy: CommitBoxStrategy;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * Current action being performed
   */
  action: ReactRoiAction;

  /**
   * Regions of interest
   */
  rois: Array<Roi<TData>>;

  /**
   * Committed regions of interest
   */
  committedRois: Array<CommittedRoiProperties<TData>>;

  /**
   * Size of the target on which the rois are drawn
   */
  targetSize: Size;

  /**
   * Size of the container (used to normalize initial panzoom transform)
   */
  containerSize: Size;

  /**
   * Defines the current affine transformation being applied to the container
   */
  panZoom: PanZoom;

  /**
   * Defines the inital panZoom transform so that the image is appropriately scaled and centered in the container
   */
  initialPanZoom: PanZoom;

  /**
   * Zoom level min and max
   */
  zoomDomain: ZoomDomain;
}

export type CreateUpdateRoiPayload = Partial<CommittedRoiProperties> & {
  id: string;
};

export interface ZoomPayload {
  scale: number;
  containerBoundingRect: DOMRect;
  clientX: number;
  clientY: number;
}

export interface StartDrawPayload {
  event: PointerEvent | ReactPointerEvent;
  containerBoundingRect: DOMRect;
  isPanZooming: boolean;
  noUnselection?: boolean;
  lockPan: boolean;
  data?: unknown;
}

export interface PointerMovePayload {
  event: PointerEvent;
  containerBoundingRect: DOMRect;
}

export interface StartResizePayload {
  id: string;
  xAxisCorner: XCornerPosition;
  yAxisCorner: YCornerPosition;
}

export interface EndActionPayload {
  noUnselection: boolean;
  minNewRoiSize: number;
}

export interface CancelActionPayload {
  noUnselection: boolean;
}

export interface SelectBoxAndStartMovePayload {
  id: string;
}

export interface SelectBoxAndStartRotatePayload {
  id: string;
}

export type RoiReducerAction =
  | { type: 'SET_MODE'; payload: RoiMode }
  | {
      type: 'CREATE_ROI';
      payload: CreateUpdateRoiPayload;
    }
  | {
      type: 'SET_SIZE';
      payload: Size;
    }
  | {
      type: 'SET_CONTAINER_SIZE';
      payload: Size;
    }
  | {
      type: 'UPDATE_ROI';
      payload: CreateUpdateRoiPayload;
    }
  | { type: 'REMOVE_ROI'; payload?: string }
  | {
      type: 'START_RESIZE';
      payload: StartResizePayload;
    }
  | {
      type: 'START_DRAW';
      payload: StartDrawPayload;
    }
  | {
      type: 'POINTER_MOVE';
      payload: PointerMovePayload;
    }
  | {
      type: 'END_ACTION';
      payload: EndActionPayload;
    }
  | { type: 'CANCEL_ACTION'; payload: CancelActionPayload }
  | { type: 'START_PAN' }
  | {
      type: 'SELECT_BOX_AND_START_MOVE';
      payload: SelectBoxAndStartMovePayload;
    }
  | {
      type: 'SELECT_BOX_AND_START_ROTATE';
      payload: SelectBoxAndStartRotatePayload;
    }
  | {
      type: 'ZOOM';
      payload: ZoomPayload;
    }
  | {
      type: 'RESET_ZOOM';
    }
  | { type: 'UNSELECT_ROI'; payload: string }
  | { type: 'SELECT_ROI'; payload: string | null };

export function roiReducer(
  state: ReactRoiState,
  action: RoiReducerAction,
): ReactRoiState {
  return produce(state, (draft) => {
    const type = action.type;
    switch (type) {
      case 'SET_MODE':
        draft.mode = action.payload;
        break;
      case 'SET_SIZE': {
        // Ignore if size is 0
        if (action.payload.width === 0 || action.payload.height === 0) return;

        draft.targetSize = action.payload;
        updateInitialPanZoom(draft);
        sanitizeRois(draft);
        break;
      }
      case 'SET_CONTAINER_SIZE': {
        draft.containerSize = action.payload;
        updateInitialPanZoom(draft);
        break;
      }
      case 'REMOVE_ROI': {
        cancelAction(draft, { noUnselection: false });

        const id = action.payload ?? draft.selectedRoi;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        if (index === -1) return;
        draft.rois.splice(index, 1);
        draft.committedRois.splice(index, 1);
        draft.selectedRoi = undefined;
        return;
      }

      case 'SELECT_ROI': {
        const id = action.payload;
        if (id) {
          const roi = draft.rois.find((roi) => roi.id === id);
          if (roi) {
            cancelAction(draft, { noUnselection: false });
            draft.selectedRoi = id;
          }
        } else if (draft.selectedRoi) {
          cancelAction(draft, { noUnselection: false });
          draft.selectedRoi = undefined;
        }
        break;
      }

      case 'UNSELECT_ROI': {
        const id = action.payload;

        if (draft.selectedRoi === id) {
          cancelAction(draft, { noUnselection: false });
          draft.selectedRoi = undefined;
        }

        return;
      }

      case 'CREATE_ROI': {
        const { id, ...otherRoiProps } = action.payload;

        if (draft.committedRois.some((d) => d.id === id)) {
          throw new Error('This id already exists on the draft.');
        }

        const committedRoi = createCommittedRoi(id, otherRoiProps);
        draft.committedRois.push(committedRoi);
        draft.rois.push(createRoi(id, otherRoiProps));
        draft.selectedRoi = committedRoi.id;
        break;
      }

      case 'UPDATE_ROI': {
        const { id, ...updatedData } = action.payload;
        if (!id) return;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        const committedRoi = draft.committedRois[index];

        assert(index !== -1, 'ROI not found');
        assert(committedRoi, 'Committed ROI not found');

        Object.assign<CommittedRoiProperties, Partial<CommittedRoiProperties>>(
          committedRoi,
          updatedData,
        );
        draft.rois[index] = createRoiFromCommittedRoi(committedRoi);
        break;
      }

      case 'START_RESIZE': {
        const { id, xAxisCorner, yAxisCorner } = action.payload;
        const { rois } = draft;
        const roi = rois.find((roi) => roi.id === id);
        assert(roi, 'ROI not found');
        draft.action = 'resizing';
        roi.action = {
          type: 'resizing',
          xAxisCorner,
          yAxisCorner,
          remainder: {
            x: 0,
            y: 0,
          },
        };
        roi.box = changeBoxRotationCenter(roi.box, {
          xRotationCenter: xAxisCornerToCenter[xAxisCorner],
          yRotationCenter: yAxisCornerToCenter[yAxisCorner],
        });
        break;
      }

      case 'START_PAN': {
        startPan(draft);
        break;
      }
      case 'SELECT_BOX_AND_START_MOVE': {
        selectBoxAndStartAction(draft, action.payload.id, 'moving');
        break;
      }

      case 'SELECT_BOX_AND_START_ROTATE': {
        selectBoxAndStartAction(draft, action.payload.id, 'rotating');
        break;
      }

      case 'START_DRAW': {
        startDraw(draft, action.payload);
        break;
      }

      case 'POINTER_MOVE': {
        pointerMove(draft, action.payload);
        break;
      }

      case 'END_ACTION': {
        endAction(draft, action.payload);
        break;
      }

      case 'CANCEL_ACTION': {
        cancelAction(draft, action.payload);
        break;
      }
      case 'ZOOM':
        zoomAction(draft, action.payload);
        break;
      case 'RESET_ZOOM':
        resetZoomAction(draft);
        break;
      default:
        assertUnreachable(type);
    }
  });
}
