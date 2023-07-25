import { produce } from 'immer';
import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { KbsProvider } from 'react-kbs';

import { onMouseDown } from '../components/callbacks/onMouseDown';
import { onMouseMove } from '../components/callbacks/onMouseMove';
import { onMouseUp } from '../components/callbacks/onMouseUp';
import { Rectangle, Ratio, RoiStateType } from '../types';
import { CommittedRoi } from '../types/CommittedRoi';
import { Roi } from '../types/Roi';
import { dragRectangle } from '../utilities/dragRectangle';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

export const RoiActions = Object.freeze({
  SELECT: 'select',
  DRAW: 'draw',
  NONE: 'none',
});

export type RoiAction = (typeof RoiActions)[keyof typeof RoiActions];

const roiInitialState: RoiStateType = {
  mode: RoiActions.SELECT,
  startPoint: undefined,
  endPoint: undefined,
  ratio: { x: 1, y: 1 },
  delta: undefined,
  x: 0,
  y: 0,
  pointerIndex: undefined,
  selectedRoi: undefined,
  width: 0,
  height: 0,
  rois: [],
};

export type RoiState = Omit<RoiStateType, 'startPoint' | 'endPoint'>;

export type RoiReducerAction =
  | {
      type: 'setComponentPosition';
      payload: { position: Rectangle; ratio: Ratio };
    }
  | { type: 'setMode'; payload: 'select' | 'draw' }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'addRoi'; payload: Partial<CommittedRoi> & { id: string } }
  | { type: 'updateRoi'; payload: { id: string; updatedData: Partial<Roi> } }
  | { type: 'removeRoi'; payload: string | undefined }
  | { type: 'isMoving'; payload: boolean }
  | { type: 'resizeRoi'; payload: number }
  | { type: 'onMouseDown'; payload: React.MouseEvent }
  | { type: 'onMouseMove'; payload: React.MouseEvent }
  | { type: 'onMouseUp'; payload: React.MouseEvent }
  | {
      type: 'selectBoxAnnotation';
      payload: { id: string; event: React.MouseEvent };
    };

const roiReducer = (state: RoiStateType, action: RoiReducerAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'setComponentPosition':
        draft.x = action.payload.position.x;
        draft.y = action.payload.position.y;
        draft.width = action.payload.position.width;
        draft.height = action.payload.position.height;
        draft.ratio = action.payload.ratio;
        break;

      case 'isMoving': {
        const { selectedRoi, rois } = draft;
        if (draft.selectedRoi) {
          const index = rois.findIndex((roi) => roi.id === selectedRoi);
          draft.rois[index].isMoving = action.payload;
        }
        break;
      }
      case 'setMode':
        draft.mode = action.payload;
        break;

      case 'setRatio':
        draft.ratio = action.payload;
        break;

      case 'removeRoi': {
        const id = action.payload ?? draft.selectedRoi;
        const index = draft.rois.findIndex((roi) => roi.id === id);
        if (index === -1) return;
        draft.rois.splice(index, 1);
        draft.selectedRoi = undefined;
        return;
      }

      case 'addRoi': {
        const { width: targetWidth, height: targetHeight } = draft;
        const width = Math.round(targetWidth * 0.1);
        const height = Math.round(targetHeight * 0.1);
        const x = Math.round(targetWidth / 2 - width / 2);
        const y = Math.round(targetHeight / 2 - height / 2);
        draft.rois.push({
          id: crypto.randomUUID(),
          x,
          y,
          width,
          height,
          style: {
            fill: 'black',
            opacity: 0.5,
          },
          editStyle: {
            fill: 'black',
            opacity: 0.5,
          },
          ...action.payload,
          isResizing: false,
          isMoving: false,
        });
        break;
      }

      case 'updateRoi': {
        const index = draft.rois.findIndex(
          (roi) => roi.id === action.payload.id,
        );
        const roi = draft.rois[index];
        draft.rois[index] = Object.assign(roi, action.payload.updatedData);
        break;
      }

      case 'resizeRoi': {
        const { ratio, selectedRoi, rois } = draft;
        const index = rois.findIndex((roi) => roi.id === selectedRoi);
        rois[index].isResizing = true;
        if (!selectedRoi) return;
        const points = getReferencePointers(rois[index], ratio, action.payload);
        draft.pointerIndex = action.payload;
        draft.startPoint = { x: points.p0.x, y: points.p0.y };
        draft.endPoint = { x: points.p1.x, y: points.p1.y };
        break;
      }

      case 'selectBoxAnnotation': {
        const { id, event } = action.payload;
        const { ratio, x, y, rois } = draft;
        draft.selectedRoi = id;
        const index = rois.findIndex((roi) => roi.id === id);
        draft.rois[index].isMoving = true;
        if (!draft.selectedRoi) return;
        const scaledRectangle = getScaledRectangle(draft.rois[index], ratio);
        const delta = {
          dx: event.clientX - scaledRectangle.x - x,
          dy: event.clientY - scaledRectangle.y - y,
        };
        draft.delta = delta;
        const { startPoint, endPoint } = dragRectangle(draft, {
          x: scaledRectangle.x + delta.dx,
          y: scaledRectangle.y + delta.dy,
        });
        draft.startPoint = startPoint;
        draft.endPoint = endPoint;
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
};

export interface RoiStateProps<T = any> {
  roiState: RoiStateType<T>;
}

export const RoiContext = createContext<RoiStateProps>({} as RoiStateProps);

interface RoiDispatchProps {
  roiDispatch: Dispatch<RoiReducerAction>;
}

export const RoiDispatchContext = createContext<RoiDispatchProps>(
  {} as RoiDispatchProps,
);

interface ObjectProviderProps<T> {
  children: ReactNode;
  initialRois?: Array<CommittedRoi<T>>;
}

export function RoiProvider<T>({
  children,
  initialRois = [],
}: ObjectProviderProps<T>) {
  useEffect(() => {
    for (const roi of initialRois) {
      roiInitialState.rois.push({ ...roi, isResizing: false, isMoving: false });
    }
  }, [initialRois]);

  const [state, dispatch] = useReducer(roiReducer, roiInitialState);
  const roiState = useMemo(() => {
    return { roiState: state };
  }, [state]);

  const roiDispatch = useMemo(() => {
    return { roiDispatch: dispatch };
  }, [dispatch]);

  return (
    <KbsProvider>
      <RoiContext.Provider value={roiState}>
        <RoiDispatchContext.Provider value={roiDispatch}>
          {children}
        </RoiDispatchContext.Provider>
      </RoiContext.Provider>
    </KbsProvider>
  );
}
