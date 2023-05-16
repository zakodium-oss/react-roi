import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Rectangle } from '../types/Rectangle';
import {
  EventActions,
  eventReducer,
  EventStateType,
  intialEventState,
} from './EventReducer';

export type DataObject = {
  id: string | number;
  selected: boolean;
  rectangle: Rectangle;
};

export type DataState = {
  objects: DataObject[];
};

const dataContext: DataState = {
  objects: [],
};

type DataContextProps = {
  state: DataState;
  dispatch: Dispatch<Actions>;
  eventState: EventStateType;
  eventDispatch: Dispatch<EventActions>;
};

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
);

export const DataProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [state, dispatch] = useReducer(dataReducer, dataContext);
  const [eventState, eventDispatch] = useReducer(
    eventReducer,
    intialEventState
  );
  return (
    <DataContext.Provider
      value={{ state, dispatch, eventState, eventDispatch }}
    >
      {children}
    </DataContext.Provider>
  );
};

export type Actions =
  | {
      type: 'addObject';
      payload: DataObject;
    }
  | {
      type: 'updateState';
      payload: DataState;
    };

export const dataReducer = (state: DataState, action: Actions) => {
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
