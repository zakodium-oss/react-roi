import { DataObject } from '../types/DataObject';
import { Delta } from '../types/Delta';
import { Point } from '../types/Point';

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
  delta: Delta;
  object: DataObject;
  dynamicState: {
    action: DrawActions;
    point?: Point;
    delta?: Delta;
    position?: number;
  };
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
      payload: Delta;
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
  delta: { dx: 1, dy: 1 },
  dynamicState: { action: DrawActions.SLEEP, position: 0 },
};
