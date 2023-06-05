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
  /**
   * @param action Current action
   */
  action: DynamicActions;

  /**
   * @param delta offset from the point where the click was made to the top-left corner of the rectangle
   */
  delta: Delta;

  /**
   * @param objectID Identification of the selected object
   */
  objectID?: number;

  /**
   * position object with the startPoint (top-left) and endPoint (bottom-right) of the rectangle
   */
  position?: number;

  /**
   * @param startPoint Point at the top-left of the rectangle.
   */
  startPoint?: Point;

  /**
   * @param endPoint Point at the bottom-right of the rectangle.
   */
  endPoint?: Point;

  /**
   * @param ratio ratio of the width and height of the image related to the window, measured in pixels
   */
  ratio?: Ratio;

  /**
   * @param offset offset information for the SVG relative to the entire window
   */
  offset?: Offset;

  /**
   * @param pointerIndex offset index of the selected pointer
   */
  pointerIndex?: number;
};

const dynamicInitialState: DynamicStateType = {
  action: DynamicActions.SLEEP,
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 0, y: 0 },
  ratio: { x: 1, y: 1 },
  delta: { dx: 0, dy: 0 },
  offset: { top: 0, right: 0, left: 0, bottom: 0 },
  pointerIndex: undefined,
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
  | { type: 'setPosition'; payload: { startPoint: Point; endPoint: Point } }
  | { type: 'setPointerIndex'; payload: number | undefined };

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

      case 'setPointerIndex':
        draft.pointerIndex = action.payload;
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
