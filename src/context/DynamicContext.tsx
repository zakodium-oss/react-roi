import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { Delta } from '../types/Delta';
import { Point } from '../types/Point';

export const DynamicActions = Object.freeze({
  DRAG: 'drag' as const,
  DRAW: 'draw' as const,
  RESIZE: 'resize' as const,
  SLEEP: 'sleep' as const,
});

export type DynamicActions =
  (typeof DynamicActions)[keyof typeof DynamicActions];

export type DynamicStateType = {
  isMouseDown: boolean;
  action: DynamicActions;
  point?: Point;
  delta?: Delta;
  objectID?: number;
  position?: number;
};

const dynamicInitialState: DynamicStateType = {
  isMouseDown: false,
  action: DynamicActions.SLEEP,
};

export type DynamicAction =
  | {
      type: 'setIsMouseDown';
      payload: boolean;
    }
  | { type: 'setAction'; payload: DynamicActions }
  | { type: 'setPoint'; payload: Point }
  | { type: 'setDelta'; payload: Delta }
  | { type: 'setObjectID'; payload: number }
  | { type: 'setPointerPosition'; payload: number }
  | { type: 'setDynamicState'; payload: DynamicStateType };

export const dynamicReducer = (
  state: DynamicStateType,
  action: DynamicAction
) => {
  switch (action.type) {
    case 'setIsMouseDown':
      return {
        ...state,
        isMouseDown: action.payload,
      };

    case 'setAction':
      return {
        ...state,
        action: action.payload,
      };

    case 'setPoint':
      return {
        ...state,
        point: action.payload,
      };

    case 'setDelta':
      return {
        ...state,
        delta: action.payload,
      };

    case 'setObjectID':
      return {
        ...state,
        setObjectID: action.payload,
      };

    case 'setPointerPosition':
      return {
        ...state,
        position: action.payload,
      };
    case 'setDynamicState':
      return {
        ...state,
        ...action.payload,
        isMouseDown: state.isMouseDown,
      };
  }
};

type DynamicContextProps = {
  dynamicState: DynamicStateType;
  dynamicDispatch: Dispatch<DynamicAction>;
};

export const DynamicContext = createContext<DynamicContextProps>(
  {} as DynamicContextProps
);

type ObjectProviderProps = {
  children: ReactNode | ReactNode[];
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
