import { Point } from '../types/Point';
import { DataObject } from './DataContext';

export const DrawActions = Object.freeze({
  DRAG: 'drag' as const,
  DRAW: 'draw' as const,
  RESIZE: 'resize' as const,
  SLEEP: 'sleep' as const,
});

export type DrawActions = (typeof DrawActions)[keyof typeof DrawActions];

export type EventStateType = {
  isMouseDown: boolean;
  startPoint: Point;
  currentPoint: Point;
  delta: { width: number; height: number };
  object: DataObject;
  dynamicState: {
    action: DrawActions;
    point?: Point;
    delta?: Delta;
    position?: number;
  };
};

export type Delta = {
  dx: number;
  dy: number;
};

export type EventActions =
  | {
      type: 'setIsMouseDown';
      payload: boolean;
    }
  | {
      type: 'setStartPoint';
      payload: Point;
    }
  | {
      type: 'setCurrentPoint';
      payload: Point;
    }
  | {
      type: 'setDelta';
      payload: { width: number; height: number };
    }
  | {
      type: 'setObject';
      payload: DataObject;
    }
  | {
      type: 'setDynamicState';
      payload: {
        action: DrawActions;
        point?: Point;
        delta?: Delta;
        position?: number;
      };
    };

export const eventReducer = (
  eventState: EventStateType,
  action: EventActions
): EventStateType => {
  switch (action.type) {
    case 'setIsMouseDown':
      return {
        ...eventState,
        isMouseDown: action.payload,
      };
    case 'setStartPoint':
      return {
        ...eventState,
        startPoint: action.payload,
      };
    case 'setCurrentPoint':
      return {
        ...eventState,
        currentPoint: action.payload,
      };
    case 'setDelta':
      return {
        ...eventState,
        delta: action.payload,
      };
    case 'setObject':
      return {
        ...eventState,
        object: action.payload,
      };

    case 'setDynamicState':
      return {
        ...eventState,
        dynamicState: action.payload,
      };

    default:
      return eventState;
  }
};

export const intialEventState: EventStateType = {
  isMouseDown: false,
  startPoint: { x: 0, y: 0 },
  currentPoint: { x: 0, y: 0 },
  object: {
    id: 0,
    selected: false,
    rectangle: {
      origin: { column: 0, row: 0 },
      width: 0,
      height: 0,
    },
  },
  delta: { width: 1, height: 1 },
  dynamicState: { action: DrawActions.SLEEP, position: 0 },
};
