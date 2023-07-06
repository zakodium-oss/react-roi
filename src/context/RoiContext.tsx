import { produce } from 'immer';
import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { onMouseDown } from '../components/callbacks/onMouseDown';
import { onMouseMove } from '../components/callbacks/onMouseMove';
import { onMouseUp } from '../components/callbacks/onMouseUp';
import { Rectangle, Ratio, RoiObject, RoiStateType } from '../types';
import { dragRectangle } from '../utilities/dragRectangle';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

export const RoiActions = Object.freeze({
  DRAG: 'drag',
  DRAW: 'draw',
  RESIZE: 'resize',
  SLEEP: 'sleep',
});

export type RoiAction = (typeof RoiActions)[keyof typeof RoiActions];

const roiInitialState: RoiStateType = {
  action: RoiActions.SLEEP,
  startPoint: undefined,
  endPoint: undefined,
  ratio: { x: 1, y: 1 },
  delta: undefined,
  origin: { row: 0, column: 0 },
  pointerIndex: undefined,
  roiID: undefined,
  width: 0,
  height: 0,
  rois: [],
};

export type RoiReducerAction =
  | { type: 'setComponentPosition'; payload: Rectangle }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'addRois'; payload: Omit<RoiObject, 'id'>[] }
  | { type: 'removeRoi' }
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
        draft.origin = action.payload.origin;
        draft.width = action.payload.width;
        draft.height = action.payload.height;
        break;

      case 'setRatio':
        draft.ratio = action.payload;
        break;

      case 'removeRoi': {
        const index = draft.rois.findIndex(
          (object) => object.id === draft.roiID,
        );
        draft.rois.splice(index, 1);
        draft.roiID = undefined;
        return;
      }

      case 'addRois': {
        for (const roi of action.payload) {
          draft.rois.push({ id: crypto.randomUUID(), ...roi });
        }
        break;
      }

      case 'resizeRoi': {
        const { ratio, rois, roiID } = draft;
        const roi = rois.find((obj) => obj.id === roiID);
        if (!roi) return;
        const points = getReferencePointers(
          roi.rectangle,
          ratio,
          action.payload,
        );
        draft.pointerIndex = action.payload;
        draft.action = RoiActions.RESIZE;
        draft.startPoint = { x: points.p0.x, y: points.p0.y };
        draft.endPoint = { x: points.p1.x, y: points.p1.y };
        break;
      }

      case 'selectBoxAnnotation': {
        const { id, event } = action.payload;
        draft.roiID = id;
        const { ratio, origin, rois, roiID } = draft;
        const object = rois.find((obj) => obj.id === roiID);
        if (!object) return;
        const scaledRectangle = getScaledRectangle(object.rectangle, ratio);
        const delta = {
          dx: event.clientX - scaledRectangle.origin.column - origin.column,
          dy: event.clientY - scaledRectangle.origin.row - origin.row,
        };
        const { startPoint, endPoint } = dragRectangle(draft, {
          x: scaledRectangle.origin.column + delta.dx,
          y: scaledRectangle.origin.row + delta.dy,
        });
        draft.action = RoiActions.DRAG;
        draft.delta = delta;
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

type RoiStateProps = { roiState: RoiStateType };

export const RoiContext = createContext<RoiStateProps>({} as RoiStateProps);

type RoiDispatchProps = { roiDispatch: Dispatch<RoiReducerAction> };

export const RoiDispatchContext = createContext<RoiDispatchProps>(
  {} as RoiDispatchProps,
);

type ObjectProviderProps = { children: ReactNode };

// eslint-disable-next-line react-refresh/only-export-components
export let sharedRois: RoiObject[] = [];

export const RoiProvider = ({ children }: ObjectProviderProps) => {
  const [state, dispatch] = useReducer(roiReducer, roiInitialState);
  const roiState = useMemo(() => {
    return { roiState: state };
  }, [state]);

  sharedRois = state.rois;
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
};
