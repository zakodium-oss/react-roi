import { produce } from 'immer';

import { Box, PanZoom, ResizeStrategy, RoiAction, RoiMode, Size } from '..';
import { CommittedRoi, Roi } from '../types/Roi';
import { assert, assertUnreachable } from '../utilities/assert';
import { XCornerPosition, YCornerPosition } from '../utilities/coordinates';
import {
  createCommittedRoi,
  createRoi,
  createRoiFromCommittedRoi,
  renormalizeRoiPosition,
} from '../utilities/rois';

import { cancelAction } from './updaters/cancelAction';
import { endAction } from './updaters/endAction';
import { updateInitialPanZoom } from './updaters/initialPanZoom';
import { mouseMove } from './updaters/mouseMove';
import { startDraw } from './updaters/startDraw';
import { resetZoomAction, zoomAction } from './updaters/zoom';

interface ZoomDomain {
  min: number;
  max: number;
  spaceAroundTarget: number;
}

export interface ReactRoiState<T = unknown> {
  /**
   * Current mode
   */
  mode: RoiMode;

  /**
   * Resize strategy
   */
  resizeStrategy: ResizeStrategy;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * Current action being performed
   */
  action: RoiAction;

  /**
   * Regions of interest
   */
  rois: Array<Roi<T>>;

  /**
   * Committed regions of interest
   */
  committedRois: Array<CommittedRoi<T>>;

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

export type CreateUpdateRoiPayload = Partial<CommittedRoi> & { id: string };

export interface ZoomPayload {
  scale: number;
  refBoundingClientRect: DOMRect;
  clientX: number;
  clientY: number;
}

export interface StartDrawPayload {
  event: MouseEvent | React.MouseEvent;
  containerBoundingRect: DOMRect;
  isPanZooming: boolean;
  noUnselection?: boolean;
}

export type RoiReducerAction =
  | { type: 'SET_MODE'; payload: RoiMode }
  | {
      type: 'CREATE_ROI';
      payload: CreateUpdateRoiPayload;
    }
  | {
      type: 'SET_SIZE';
      payload: {
        width: number;
        height: number;
      };
    }
  | {
      type: 'SET_CONTAINER_SIZE';
      payload: {
        width: number;
        height: number;
      };
    }
  | {
      type: 'UPDATE_ROI';
      payload: CreateUpdateRoiPayload;
    }
  | { type: 'REMOVE_ROI'; payload?: string }
  | {
      type: 'START_RESIZE';
      payload: {
        id: string;
        xAxisCorner: XCornerPosition;
        yAxisCorner: YCornerPosition;
      };
    }
  | {
      type: 'START_DRAW';
      payload: StartDrawPayload;
    }
  | {
      type: 'MOUSE_MOVE';
      payload: MouseEvent;
    }
  | {
      type: 'END_ACTION';
    }
  | { type: 'CANCEL_ACTION' }
  | {
      type: 'SELECT_BOX_AND_START_MOVE';
      payload: { id: string };
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

        // Update absolute positions
        draft.rois.forEach((roi) => {
          Object.assign<Roi, Box>(
            roi,
            renormalizeRoiPosition(roi, draft.targetSize, action.payload),
          );
        });
        draft.targetSize = action.payload;
        updateInitialPanZoom(draft);
        break;
      }
      case 'SET_CONTAINER_SIZE': {
        draft.containerSize = action.payload;
        updateInitialPanZoom(draft);
        break;
      }
      case 'REMOVE_ROI': {
        cancelAction(draft);

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
            cancelAction(draft);
            draft.selectedRoi = id;
          }
        } else if (draft.selectedRoi) {
          cancelAction(draft);
          draft.selectedRoi = undefined;
        }
        break;
      }

      case 'UNSELECT_ROI': {
        const id = action.payload;

        if (draft.selectedRoi === id) {
          cancelAction(draft);
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
        draft.rois.push(createRoi(id, draft.targetSize, otherRoiProps));
        draft.selectedRoi = committedRoi.id;
        break;
      }

      case 'UPDATE_ROI': {
        const { id, ...updatedData } = action.payload;
        if (!id) return;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        const committedRois = draft.committedRois[index];

        assert(index !== -1, 'ROI not found');
        assert(committedRois, 'Committed ROI not found');

        Object.assign<CommittedRoi, Partial<CommittedRoi>>(
          committedRois,
          updatedData,
        );
        draft.rois[index] = createRoiFromCommittedRoi(
          committedRois,
          draft.targetSize,
        );
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
        };
        break;
      }

      case 'SELECT_BOX_AND_START_MOVE': {
        const { id } = action.payload;
        if (!id) return;
        if (draft.mode === 'draw') {
          draft.selectedRoi = undefined;
          return;
        }
        const { rois } = draft;
        draft.selectedRoi = id;
        const roi = rois.find((roi) => roi.id === id);
        assert(roi, 'ROI not found');
        draft.action = 'moving';
        roi.action = {
          type: 'moving',
        };
        break;
      }

      case 'START_DRAW': {
        startDraw(draft, action.payload);
        break;
      }

      case 'MOUSE_MOVE': {
        mouseMove(draft, action.payload);
        break;
      }

      case 'END_ACTION': {
        endAction(draft);
        break;
      }

      case 'CANCEL_ACTION': {
        cancelAction(draft);
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
