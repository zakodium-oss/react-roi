import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Rectangle } from '../types/Rectangle';
import {
  EventActions,
  eventReducer,
  EventStateType,
  intialEventState,
} from './EventReducer';

export type DragObject = {
  id: string | number;
  selected: boolean;
  rectangle: Rectangle;
};

export type DragState = {
  objects: DragObject[];
};

const dragContext: DragState = {
  objects: [],
};

type DragContextProps = {
  state: DragState;
  dispatch: Dispatch<Actions>;
  eventState: EventStateType;
  eventDispatch: Dispatch<EventActions>;
};

export const DragContext = createContext<DragContextProps>(
  {} as DragContextProps
);

export const DragProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [state, dispatch] = useReducer(dataReducer, dragContext);
  const [eventState, eventDispatch] = useReducer(
    eventReducer,
    intialEventState
  );
  return (
    <DragContext.Provider
      value={{ state, dispatch, eventState, eventDispatch }}
    >
      {children}
    </DragContext.Provider>
  );
};

export type Actions =
  | {
      type: 'addObject';
      payload: DragObject;
    }
  | {
      type: 'updateState';
      payload: DragState;
    };

export const dataReducer = (state: DragState, action: Actions) => {
  switch (action.type) {
    case 'addObject':
      state.objects.push(action.payload);
      return state;

    case 'updateState':
      return action.payload;

    default:
      return state;
  }
};
