import { produce } from 'immer';

import { Box } from '../types';
import { CommittedRoi, Roi } from '../types/Roi';
import { assert, assertUnreachable } from '../utilities/assert';
import { XCornerPosition, YCornerPosition } from '../utilities/coordinates';
import {
  createCommitedRoi,
  createRoi,
  renormalizeRoiPosition,
} from '../utilities/rois';

import { PanZoomContext } from './contexts';
import { cancelAction } from './updaters/cancelAction';
import { endAction } from './updaters/endAction';
import { mouseMove } from './updaters/mouseMove';
import { startDraw } from './updaters/startDraw';
import { resetZoomAction, zoomAction } from './updaters/zoom';

interface Size {
  width: number;
  height: number;
}
export interface ReactRoiState<T = unknown> {
  /**
   * Current mode
   */
  mode: RoiMode;

  /**
   * Identification of the selected object
   */
  selectedRoi?: string;

  /**
   * Current action being performed
   */
  action: 'idle' | 'moving' | 'drawing' | 'panning' | 'resizing';

  /**
   * rois
   */
  rois: Array<Roi<T>>;

  /**
   * commited rois
   */
  committedRois: Array<CommittedRoi<T>>;

  /**
   * Size of the container used to normalize coordinates
   */
  size: Size;

  /**
   * Defines the current affine transformation being applied to the container
   */
  panZoom: PanZoomContext;
}

export type RoiMode = 'select' | 'draw';

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
  | { type: 'CANCEL_ACTION'; payload: React.KeyboardEvent }
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
    };

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
            renormalizeRoiPosition(roi, draft.size, action.payload),
          );
        });
        draft.size = action.payload;
        break;
      }
      case 'REMOVE_ROI': {
        const id = action.payload ?? draft.selectedRoi;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        if (index === -1) return;
        draft.rois.splice(index, 1);
        draft.committedRois.splice(index, 1);
        draft.selectedRoi = undefined;
        return;
      }

      case 'CREATE_ROI': {
        const { id, ...otherRoiProps } = action.payload;
        const commitedRoi = createCommitedRoi(id, otherRoiProps);
        draft.committedRois.push(commitedRoi);
        draft.rois.push(createRoi(id, draft.size, otherRoiProps));
        draft.selectedRoi = commitedRoi.id;
        break;
      }

      case 'UPDATE_ROI': {
        const { id, ...updatedData } = action.payload;
        if (!id) return;
        const commitedRoi = draft.committedRois.find((roi) => roi.id === id);
        const roi = draft.rois.find((roi) => roi.id === id);

        assert(roi, 'ROI not found');
        assert(commitedRoi, 'Commited ROI not found');

        Object.assign<CommittedRoi, Partial<CommittedRoi>>(
          commitedRoi,
          updatedData,
        );
        Object.assign<Roi, Partial<Roi>>(roi, updatedData);
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
        const index = draft.rois.findIndex((roi) => roi.id === id);
        assert(index !== -1, 'ROI not found');
        const roi = draft.rois.splice(index, 1)[0];
        const commitedRoi = draft.committedRois.splice(index, 1)[0];
        draft.selectedRoi = id;
        draft.action = 'moving';
        roi.action = { type: 'moving' };
        draft.rois.push(roi);
        draft.committedRois.push(commitedRoi);
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
