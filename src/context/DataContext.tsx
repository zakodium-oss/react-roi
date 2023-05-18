import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Rectangle } from '../types/Rectangle';
import {
  EventActions,
  eventReducer,
  EventStateType,
  intialEventState,
} from './EventReducer';
import { DataObject } from '../types/DataObject';

export type DataState = {
  objects: DataObject[];
};

const dataContext: DataState = {
  objects: [],
};

export type DataContextProps = {
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
  const [state, dispatch] = useReducer(objectReducer, dataContext);
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
      type: 'updateObject';
      payload: DataState;
    };

export const objectReducer = (state: DataState, action: Actions) => {
  switch (action.type) {
    case 'addObject':
      state.objects.push(action.payload);
      return state;

    case 'updateObject':
      return action.payload;

    default:
      return state;
  }
};
