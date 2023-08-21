import { produce } from 'immer';

import { Box } from '../types';
import { CommittedRoi, Roi } from '../types/Roi';
import { assert } from '../utilities/assert';
import { XAxisCorner, YAxisCorner } from '../utilities/coordinates';
import {
  createCommitedRoi,
  createRoi,
  renormalizeRoiPosition,
} from '../utilities/rois';

import { onMouseDown } from './updaters/onMouseDown';
import { onMouseMove } from './updaters/onMouseMove';
import { onMouseUp } from './updaters/onMouseUp';

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
}

export type RoiState = Omit<ReactRoiState, 'startPoint' | 'endPoint'>;

export type RoiMode = 'select' | 'draw';

export type UpdateRoiPayload = Partial<CommittedRoi> & { id: string };

export interface CreateRoiPayload {
  roi: Partial<CommittedRoi> & { id: string };
}

export interface MouseEventPayload {
  event: MouseEvent | React.MouseEvent;
  containerBoundingRect: DOMRect;
}

export type RoiReducerAction =
  | { type: 'setMode'; payload: RoiMode }
  | {
      type: 'addRoi';
      payload: CreateRoiPayload;
    }
  | {
      type: 'setSize';
      payload: {
        width: number;
        height: number;
      };
    }
  | {
      type: 'updateRoi';
      payload: UpdateRoiPayload;
    }
  | { type: 'removeRoi'; payload?: string }
  | {
      type: 'resizeRoi';
      payload: {
        id: string;
        xAxisCorner: XAxisCorner;
        yAxisCorner: YAxisCorner;
      };
    }
  | {
      type: 'onMouseDown';
      payload: MouseEventPayload;
    }
  | {
      type: 'onMouseMove';
      payload: MouseEvent;
    }
  | {
      type: 'onMouseUp';
    }
  | { type: 'cancelDrawing'; payload: React.KeyboardEvent }
  | {
      type: 'selectBoxAnnotation';
      payload: { id: string };
    };

export function roiReducer(
  state: ReactRoiState,
  action: RoiReducerAction,
): ReactRoiState {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'setMode':
        draft.mode = action.payload;
        break;
      case 'setSize': {
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
      case 'removeRoi': {
        const id = action.payload ?? draft.selectedRoi;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        if (index === -1) return;
        draft.rois.splice(index, 1);
        draft.committedRois.splice(index, 1);
        draft.selectedRoi = undefined;
        return;
      }

      case 'addRoi': {
        const { id, ...otherRoiProps } = action.payload.roi;
        const commitedRoi = createCommitedRoi(id, otherRoiProps);
        draft.committedRois.push(commitedRoi);
        draft.rois.push(createRoi(id, draft.size, otherRoiProps));
        draft.selectedRoi = commitedRoi.id;
        break;
      }

      case 'updateRoi': {
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

      case 'resizeRoi': {
        const { id, xAxisCorner, yAxisCorner } = action.payload;
        const { rois } = draft;
        const roi = rois.find((roi) => roi.id === id);
        assert(roi, 'ROI not found');

        roi.action = {
          type: 'resizing',
          xAxisCorner,
          yAxisCorner,
        };
        break;
      }

      case 'selectBoxAnnotation': {
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

        roi.action = {
          type: 'moving',
        };
        break;
      }

      case 'onMouseDown': {
        onMouseDown(draft, action.payload);
        break;
      }

      case 'onMouseMove': {
        onMouseMove(draft, action.payload);
        break;
      }

      case 'onMouseUp': {
        onMouseUp(draft);
        break;
      }

      default:
        break;
    }
  });
}
