import { Point } from '../types/Point';

export type EventStateType = {
  isMouseDown: boolean;
  startPosition: Point;
  currentPosition: Point;
  delta: { width: number; height: number };
  object: string | number;
  resizerState: {
    active: boolean;
    position: number;
    id: number | string | undefined;
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
      payload: string | number;
    }
  | {
      type: 'setResizerState';
      payload: {
        active: boolean;
        position: number;
        id: number | string | undefined;
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

    case 'setResizerState':
      return {
        ...eventState,
        resizerState: action.payload,
      };
    default:
      return eventState;
  }
};
