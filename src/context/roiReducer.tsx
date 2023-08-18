import { produce } from 'immer';

import { onMouseDown } from '../components/callbacks/onMouseDown';
import { onMouseMove } from '../components/callbacks/onMouseMove';
import { onMouseUp } from '../components/callbacks/onMouseUp';
import { Ratio } from '../types';
import { CommittedRoi } from '../types/CommittedRoi';
import { Roi } from '../types/Roi';
import { commitedRoiTemplate } from '../utilities/commitedRoiTemplate';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';
import { roiTemplate } from '../utilities/roiTemplate';

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
   * The ratio of the width to the height of the original object is in relation to the target width and height, and it is measured in pixels.
   */
  ratio: Ratio;

  /**
   * rois
   */
  rois: Array<Roi<T>>;

  /**
   * commited rois
   */
  commitedRois: Array<CommittedRoi<T>>;
}

export type RoiState = Omit<ReactRoiState, 'startPoint' | 'endPoint'>;

export type RoiMode = 'select' | 'draw';

export type RoiReducerAction<T = unknown> =
  | { type: 'setMode'; payload: RoiMode }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'addRoi'; payload: Partial<CommittedRoi<T>> & { id: string } }
  | {
      type: 'updateRoi';
      payload: { id: string; updatedData: Partial<CommittedRoi<T>> };
    }
  | { type: 'removeRoi'; payload?: string }
  | { type: 'resizeRoi'; payload: number }
  | { type: 'onMouseDown'; payload: React.MouseEvent }
  | { type: 'onMouseMove'; payload: React.MouseEvent }
  | { type: 'onMouseUp'; payload: React.MouseEvent }
  | { type: 'cancelDrawing'; payload: React.KeyboardEvent }
  | {
      type: 'selectBoxAnnotation';
      payload: { id: string; event: React.MouseEvent };
    };

export function roiReducer<T>(
  state: ReactRoiState<T>,
  action: RoiReducerAction<T>,
): ReactRoiState<T> {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'setMode':
        draft.mode = action.payload;
        break;

      case 'setRatio':
        draft.ratio = action.payload;
        for (const commitedRoi of draft.commitedRois) {
          const index = draft.rois.findIndex(
            (roi) => roi.id === commitedRoi.id,
          );
          const { x, y, height, width } = getScaledRectangle(
            commitedRoi,
            action.payload,
          );
          draft.rois[index].actionData = {
            startPoint: { x, y },
            endPoint: { x: x + width, y: y + height },
          };
        }
        break;

      case 'removeRoi': {
        const id = action.payload ?? draft.selectedRoi;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        if (index === -1) return;
        draft.rois.splice(index, 1);
        draft.commitedRois.splice(index, 1);
        draft.selectedRoi = undefined;
        return;
      }

      case 'addRoi': {
        const { width: targetWidth, height: targetHeight } = document
          .getElementById('roi-container-svg')
          .getBoundingClientRect();
        const roiWidth = Math.round(targetWidth * 0.1);
        const roiHeight = Math.round(targetHeight * 0.1);
        const roiX = Math.round(targetWidth / 2 - roiWidth) * draft.ratio.x;
        const roiY = Math.round(targetHeight / 2 - roiHeight) * draft.ratio.y;
        const commitedRoi = commitedRoiTemplate<T>(crypto.randomUUID(), {
          x: roiX,
          y: roiY,
          width: roiWidth,
          height: roiHeight,
          ...action.payload,
        });
        const { x, y, width, height, ...roi } = commitedRoi;
        // TODO: check those errors
        // @ts-expect-error need to check
        draft.commitedRois.push(commitedRoi);
        draft.rois.push(
          // @ts-expect-error need to check
          roiTemplate<T>(commitedRoi.id, {
            action: 'idle',
            actionData: {
              startPoint: { x: x / draft.ratio.x, y: y / draft.ratio.y },
              endPoint: {
                x: (x + width) / draft.ratio.x,
                y: (y + height) / draft.ratio.y,
              },
              delta: undefined,
              pointerIndex: undefined,
            },
            ...roi,
          }),
        );
        draft.selectedRoi = commitedRoi.id;
        break;
      }

      case 'updateRoi': {
        const { id, updatedData } = action.payload;
        if (!id) return;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        const commitedRoi = Object.assign(
          draft.commitedRois[index],
          updatedData,
        );
        draft.commitedRois[index] = commitedRoi;
        const { x, y, width, height, editStyle, style, data, label } =
          commitedRoi;
        draft.rois[index] = {
          id,
          label,
          style,
          editStyle,
          data,
          action: 'idle',
          actionData: {
            startPoint: { x: x / draft.ratio.x, y: y / draft.ratio.y },
            endPoint: {
              x: (x + width) / draft.ratio.x,
              y: (y + height) / draft.ratio.y,
            },
          },
        };
        break;
      }

      case 'resizeRoi': {
        const { ratio, selectedRoi, rois, commitedRois } = draft;
        const index = rois.findIndex((roi) => roi.id === selectedRoi);
        const roi = draft.rois[index];
        roi.action = 'resizing';
        if (!selectedRoi) return;
        const points = getReferencePointers(
          commitedRois[index],
          ratio,
          action.payload,
        );
        roi.actionData.pointerIndex = action.payload;
        roi.actionData.startPoint = { x: points.p0.x, y: points.p0.y };
        roi.actionData.endPoint = { x: points.p1.x, y: points.p1.y };
        break;
      }

      case 'selectBoxAnnotation': {
        const { id, event } = action.payload;
        if (!id) return;
        if (draft.mode === 'draw') {
          draft.selectedRoi = undefined;
          return;
        }
        const { rois } = draft;
        const { x: svgX, y: svgY } = document
          .getElementById('roi-container-svg')
          .getBoundingClientRect();
        draft.selectedRoi = id;
        const roi = rois.find((roi) => roi.id === id);
        roi.action = 'moving';
        if (!draft.selectedRoi) return;
        const { startPoint, endPoint } = roi.actionData;
        const rectangle = getRectangleFromPoints(startPoint, endPoint);
        const { x, y } = rectangle;
        roi.actionData.delta = {
          x: event.clientX - x - svgX,
          y: event.clientY - y - svgY,
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
        onMouseUp(draft, action.payload);
        break;
      }

      default:
        break;
    }
  });
}
