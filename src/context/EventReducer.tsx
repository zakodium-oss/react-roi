import { Point } from '../types/Point';

export type EventStateType = {
  isMouseDown: boolean;
  startPosition: Point;
  currentPosition: Point;
  delta: { width: number; height: number };
  object: string | number | undefined;
  setChangeState: {
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
      type: 'setStartPosition';
      payload: Point;
    }
  | {
      type: 'setCurrentPosition';
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
      type: 'setChangeState';
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
    case 'setStartPosition':
      return {
        ...eventState,
        startPosition: action.payload,
      };
    case 'setCurrentPosition':
      return {
        ...eventState,
        currentPosition: action.payload,
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

    case 'setChangeState':
      return {
        ...eventState,
        setChangeState: action.payload,
      };

    default:
      return eventState;
  }
};

export const intialEventState = {
  isMouseDown: false,
  startPosition: { x: 0, y: 0 },
  currentPosition: { x: 0, y: 0 },
  object: 0,
  delta: { width: 1, height: 1 },
  setChangeState: { resize: false, drag: false, id: 0, position: 0 },
};
