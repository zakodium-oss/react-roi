import { produce } from 'immer';
import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { onMouseDown } from '../components/callbacks/onMouseDown';
import { onMouseMove } from '../components/callbacks/onMouseMove';
import { onMouseUp } from '../components/callbacks/onMouseUp';
import { Delta } from '../types/Delta';
import { DynamicStateType } from '../types/DynamicStateType';
import { Offset } from '../types/Offset';
import { Point } from '../types/Point';
import { Ratio } from '../types/Ratio';
import { addObject } from '../utilities/addObject';
import { dragRectangle } from '../utilities/dragRectangle';
import { getRectangle } from '../utilities/getRectangle';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

export const DynamicActions = Object.freeze({
  DRAG: 'drag',
  DRAW: 'draw',
  RESIZE: 'resize',
  SLEEP: 'sleep',
});

export type DynamicAction =
  (typeof DynamicActions)[keyof typeof DynamicActions];

const dynamicInitialState: DynamicStateType = {
  action: DynamicActions.SLEEP,
  startPoint: undefined,
  endPoint: undefined,
  ratio: { x: 1, y: 1 },
  delta: undefined,
  offset: { top: 0, right: 0, left: 0, bottom: 0 },
  pointerIndex: undefined,
  objectID: undefined,
  width: 0,
  height: 0,
  objects: [
    {
      id: '0.08787081976685629',
      rectangle: { origin: { row: 152, column: 369 }, width: 83, height: 15 },
      options: { type: '', label: '', fill: [0, 0, 255, 0.8] },
    },
    {
      id: '0.5108332018722821',
      rectangle: { origin: { row: 193, column: 343 }, width: 34, height: 15 },
    },
    {
      id: '0.05981619466014365',
      rectangle: { origin: { row: 295, column: 346 }, width: 115, height: 32 },
    },
    {
      id: '0.3942252292733659',
      rectangle: { origin: { row: 83, column: 685 }, width: 72, height: 33 },
    },
  ],
};

export type DynamicReducerAction =
  | { type: 'setAction'; payload: DynamicAction }
  | { type: 'setDelta'; payload: Delta }
  | { type: 'setObjectID'; payload: string | undefined }
  | { type: 'setDynamicState'; payload: Partial<DynamicStateType> }
  | { type: 'setStartPoint'; payload: Point }
  | { type: 'setEndPoint'; payload: Point }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'setOffset'; payload: Offset }
  | { type: 'setPosition'; payload: { startPoint: Point; endPoint: Point } }
  | { type: 'setPointerIndex'; payload: number | undefined }
  | { type: 'addObject'; payload: string }
  | { type: 'removeObject'; payload: string }
  | { type: 'dragRectangle'; payload: { id?: string; point: Point } }
  | { type: 'updatePosition'; payload: number }
  | { type: 'updateRectangle' }
  | { type: 'onMouseDown'; payload: React.MouseEvent }
  | { type: 'onMouseMove'; payload: React.MouseEvent }
  | { type: 'onMouseUp'; payload: React.MouseEvent }
  | { type: 'selectObject'; payload: React.MouseEvent }
  | {
      type: 'selectBoxAnnotation';
      payload: { id: string; event: React.MouseEvent };
    };

const dynamicReducer = (
  state: DynamicStateType,
  action: DynamicReducerAction,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'setAction':
        draft.action = action.payload;
        break;

      case 'setDelta':
        draft.delta = action.payload;
        break;

      case 'setObjectID':
        draft.objectID = action.payload;
        break;

      case 'setDynamicState':
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

      case 'removeObject': {
        const index = draft.objects.findIndex(
          (object) => object.id === action.payload,
        );
        draft.objects.splice(index, 1);
        draft.objectID = undefined;
        return;
      }

      case 'addObject': {
        addObject(draft, action.payload);
        break;
      }

      case 'updateRectangle': {
        const { startPoint, endPoint, ratio, objects, objectID } = draft;
        const object = objects.find((obj) => obj.id === objectID);
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
        const { ratio, objects, objectID } = draft;
        const object = objects.find((obj) => obj.id === objectID);
        if (!object) return;
        const points = getReferencePointers(
          object.rectangle,
          ratio,
          action.payload,
        );
        draft.startPoint = { x: points.p0.x, y: points.p0.y };
        draft.endPoint = { x: points.p1.x, y: points.p1.y };
        break;
      }

      case 'selectBoxAnnotation': {
        const { id, event } = action.payload;
        draft.objectID = id;
        const { ratio, offset, objects, objectID } = draft;
        const object = objects.find((obj) => obj.id === objectID);
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
        draft.action = DynamicActions.DRAG;
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

type DynamicContextProps = {
  dynamicState: DynamicStateType;
  dynamicDispatch: Dispatch<DynamicReducerAction>;
};

export const DynamicContext = createContext<DynamicContextProps>(
  {} as DynamicContextProps,
);

type ObjectProviderProps = {
  children: ReactNode;
};

export const DynamicProvider = ({ children }: ObjectProviderProps) => {
  const [dynamicState, dynamicDispatch] = useReducer(
    dynamicReducer,
    dynamicInitialState,
  );
  return (
    <KbsProvider>
      <DynamicContext.Provider value={{ dynamicState, dynamicDispatch }}>
        {children}
      </DynamicContext.Provider>
    </KbsProvider>
  );
};
