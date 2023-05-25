import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { produce } from 'immer';

import { Delta } from '../types/Delta';
import { Point } from '../types/Point';
import { Ratio } from '../types/Ratio';
import { Offset } from '../types/Offset';

export const DynamicActions = Object.freeze({
  DRAG: 'drag',
  DRAW: 'draw',
  RESIZE: 'resize',
  SLEEP: 'sleep',
});

export type DynamicActions =
  (typeof DynamicActions)[keyof typeof DynamicActions];

export type DynamicStateType = {
  action: DynamicActions;
  delta: Delta;
  objectID?: number;
  position?: number;
  startPoint?: Point;
  endPoint?: Point;
  ratio?: Ratio;
  offset?: Offset;
};

const dynamicInitialState: DynamicStateType = {
  action: DynamicActions.SLEEP,
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 0, y: 0 },
  ratio: { x: 1, y: 1 },
  delta: { dx: 0, dy: 0 },
  offset: { top: 0, right: 0, left: 0, bottom: 0 },
};

export type DynamicAction =
  | { type: 'setAction'; payload: DynamicActions }
  | { type: 'setDelta'; payload: Delta }
  | { type: 'setObjectID'; payload: number }
  | { type: 'setDynamicState'; payload: DynamicStateType }
  | { type: 'setStartPoint'; payload: Point }
  | { type: 'setEndPoint'; payload: Point }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'setOffset'; payload: Offset }
  | { type: 'setPosition'; payload: { startPoint: Point; endPoint: Point } };

export const dynamicReducer = (
  state: DynamicStateType,
  action: DynamicAction
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

      default:
        break;
    }
  });
};

type DynamicContextProps = {
  dynamicState: DynamicStateType;
  dynamicDispatch: Dispatch<DynamicAction>;
};

export const DynamicContext = createContext<DynamicContextProps>(
  {} as DynamicContextProps
);

type ObjectProviderProps = {
  children: ReactNode;
};

export const DynamicProvider = ({ children }: ObjectProviderProps) => {
  const [dynamicState, dynamicDispatch] = useReducer(
    dynamicReducer,
    dynamicInitialState
  );
  return (
    <DynamicContext.Provider value={{ dynamicState, dynamicDispatch }}>
      {children}
    </DynamicContext.Provider>
  );
};
