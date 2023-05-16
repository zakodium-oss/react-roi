import { Point } from '../types/Point';

export type EventStateType = {
  isMouseDown: boolean;
  startPoint: Point;
  currentPoint: Point;
  delta: { width: number; height: number };
  object: string | number | undefined;
  dynamicState: {
    resize: boolean;
    drag: boolean;
    delta?: Point & { dx: number; dy: number };
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
      payload: { width: number; height: number };
    }
  | {
      type: 'setObject';
      payload: string | number | undefined;
    }
  | {
      type: 'setDynamicState';
      payload: {
        resize: boolean;
        drag: boolean;
        delta?: Point & { dx: number; dy: number };
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

export const intialEventState = {
  isMouseDown: false,
  startPoint: { x: 0, y: 0 },
  currentPoint: { x: 0, y: 0 },
  object: 0,
  delta: { width: 1, height: 1 },
  dynamicState: { resize: false, drag: false, id: 0, position: 0 },
};
