import { produce } from 'immer';
import { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { onMouseDown } from '../components/callbacks/onMouseDown';
import { onMouseMove } from '../components/callbacks/onMouseMove';
import { onMouseUp } from '../components/callbacks/onMouseUp';
import { Delta } from '../types/Delta';
import { Offset } from '../types/Offset';
import { Point } from '../types/Point';
import { Ratio } from '../types/Ratio';
import { RoiObject } from '../types/RoiObject';
import { RoiStateType } from '../types/RoiStateType';
import { addObject } from '../utilities/addObject';
import { dragRectangle } from '../utilities/dragRectangle';
import { getRectangle } from '../utilities/getRectangle';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
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
  offset: { top: 0, right: 0, left: 0, bottom: 0 },
  pointerIndex: undefined,
  roiID: undefined,
  width: 0,
  height: 0,
  rois: [],
};

export type RoiReducerAction =
  | { type: 'setAction'; payload: RoiAction }
  | { type: 'setDelta'; payload: Delta }
  | { type: 'setRoiID'; payload: string | undefined }
  | { type: 'setRoiState'; payload: Partial<RoiStateType> }
  | { type: 'setStartPoint'; payload: Point }
  | { type: 'setEndPoint'; payload: Point }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'setOffset'; payload: Offset }
  | { type: 'setPosition'; payload: { startPoint: Point; endPoint: Point } }
  | { type: 'setPointerIndex'; payload: number | undefined }
  | { type: 'addRoi'; payload: string }
  | { type: 'addRois'; payload: Omit<RoiObject, 'id'>[] }
  | { type: 'removeRoi' }
  | { type: 'dragRectangle'; payload: { id?: string; point: Point } }
  | { type: 'updatePosition'; payload: number }
  | { type: 'updateRectangle' }
  | { type: 'onMouseDown'; payload: React.MouseEvent }
  | { type: 'onMouseMove'; payload: React.MouseEvent }
  | { type: 'onMouseUp'; payload: React.MouseEvent }
  | { type: 'selectRoi'; payload: React.MouseEvent }
  | {
      type: 'selectBoxAnnotation';
      payload: { id: string; event: React.MouseEvent };
    };

const roiReducer = (state: RoiStateType, action: RoiReducerAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'setAction':
        draft.action = action.payload;
        break;

      case 'setDelta':
        draft.delta = action.payload;
        break;

      case 'setRoiID':
        draft.roiID = action.payload;
        break;

      case 'setRoiState':
        Object.assign(draft, action.payload);
        break;

      case 'setPosition':
        draft.startPoint = action.payload.startPoint;
        draft.endPoint = action.payload.endPoint;
        break;

      case 'setStartPoint':
        draft.startPoint = action.payload;
        break;

      case 'setEndPoint':
        draft.endPoint = action.payload;
        break;

      case 'setRatio':
        draft.ratio = action.payload;
        break;

      case 'setOffset':
        draft.offset = action.payload;
        break;

      case 'setPointerIndex':
        draft.pointerIndex = action.payload;
        break;

      case 'removeRoi': {
        const index = draft.rois.findIndex(
          (object) => object.id === draft.roiID,
        );
        draft.rois.splice(index, 1);
        draft.roiID = undefined;
        return;
      }

      case 'addRoi': {
        addObject(draft, action.payload);
        break;
      }

      case 'addRois': {
        for (const roi of action.payload) {
          draft.rois.push({ id: crypto.randomUUID(), ...roi });
        }
        break;
      }

      case 'updateRectangle': {
        const { startPoint, endPoint, ratio, rois, roiID } = draft;
        const object = rois.find((obj) => obj.id === roiID);
        if (object) {
          object.rectangle = getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio,
          );
        }
        break;
      }

      case 'dragRectangle': {
        const { point } = action.payload;
        const { startPoint, endPoint } = dragRectangle(draft, point);
        draft.startPoint = startPoint;
        draft.endPoint = endPoint;
        break;
      }

      case 'updatePosition': {
        const { ratio, rois, roiID } = draft;
        const object = rois.find((obj) => obj.id === roiID);
        if (!object) return;
        const points = getReferencePointers(
          object.rectangle,
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
        const { ratio, offset, rois, roiID } = draft;
        const object = rois.find((obj) => obj.id === roiID);
        if (!object) return;
        const scaledRectangle = getScaledRectangle(object.rectangle, ratio);
        const delta = {
          dx: event.clientX - scaledRectangle.origin.column - offset.left,
          dy: event.clientY - scaledRectangle.origin.row - offset.top,
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

type RoiDispatchProps = {
  roiDispatch: Dispatch<RoiReducerAction>;
};

export const RoiDispatchContext = createContext<RoiDispatchProps>(
  {} as RoiDispatchProps,
);

type ObjectProviderProps = {
  children: ReactNode;
};

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
