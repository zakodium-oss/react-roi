import { produce } from 'immer';
import { Dispatch, createContext, useMemo, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { onMouseDown } from '../components/callbacks/onMouseDown';
import { onMouseMove } from '../components/callbacks/onMouseMove';
import { onMouseUp } from '../components/callbacks/onMouseUp';
import { Ratio, RoiContainerState } from '../types';
import { CommittedRoi } from '../types/CommittedRoi';
import { Roi } from '../types/Roi';
import { commitedRoiTemplate } from '../utilities/commitedRoiTemplate';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';
import { roiTemplate } from '../utilities/roiTemplate';

function createInitialState<T>(
  commitedRois: Array<CommittedRoi<T>>,
): RoiContainerState<T> {
  const roiInitialState = {
    mode: 'select',
    ratio: { x: 1, y: 1 },
    selectedRoi: undefined,
    commitedRois,
    rois: commitedRois.map((roi) => ({
      id: roi.id,
      label: roi.label,
      editStyle: roi.editStyle,
      style: roi.style,
      data: roi.data,
      action: 'idle',
      actionData: {
        delta: undefined,
        endPoint: { x: roi.x + roi.width, y: roi.y + roi.height },
        startPoint: { x: roi.x, y: roi.y },
        pointerIndex: undefined,
      },
    })) as Array<Roi<T>>,
  };
  return roiInitialState;
}

export type RoiState = Omit<RoiContainerState, 'startPoint' | 'endPoint'>;

export type RoiReducerAction<T> =
  | { type: 'setMode'; payload: 'select' | 'draw' }
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

function roiReducer<T>(
  state: RoiContainerState<T>,
  action: RoiReducerAction<T>,
): RoiContainerState<T> {
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

export const RoiStateContext = createContext<
  Omit<RoiContainerState<any>, 'commitedRois' | 'rois'> | undefined
>(undefined);

export const RoiDispatchContext = createContext<
  Dispatch<RoiReducerAction<any>> | undefined
>(undefined);

export const CommitedRoisContext = createContext<
  Array<CommittedRoi<any>> | undefined
>(undefined);

export const RoisContext = createContext<Array<Roi<any>> | undefined>(
  undefined,
);

interface RoiProviderProps<T> {
  children: JSX.Element;
  initialRois?: Array<CommittedRoi<T>>;
}

export function RoiProvider<T>({
  children,
  initialRois = [],
}: RoiProviderProps<T>) {
  const roiInitialState = createInitialState<T>(initialRois);
  const [state, dispatch] = useReducer(roiReducer<T>, roiInitialState);
  const { rois, commitedRois, ...remainingState } = state;
  const roiState = useMemo(() => {
    return remainingState;
  }, [remainingState]);

  const roiDispatch = useMemo(() => {
    return dispatch;
  }, [dispatch]);

  const commitedRoisState = useMemo(() => {
    return commitedRois;
  }, [commitedRois]);

  const roisState = useMemo(() => {
    return rois;
  }, [rois]);

  return (
    <KbsProvider>
      <RoiDispatchContext.Provider value={roiDispatch}>
        <RoisContext.Provider value={roisState}>
          <CommitedRoisContext.Provider value={commitedRoisState}>
            <RoiStateContext.Provider value={roiState}>
              {children}
            </RoiStateContext.Provider>
          </CommitedRoisContext.Provider>
        </RoisContext.Provider>
      </RoiDispatchContext.Provider>
    </KbsProvider>
  );
}
