import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Rectangle } from '../types/Rectangle';
import {
  EventActions,
  eventReducer,
  EventStateType,
  intialEventState,
} from './EventReducer';
import { DataObject } from '../types/DataObject';

export type ObjectStateType = {
  objects: DataObject[];
};

const objectInitialState: ObjectStateType = {
  objects: [],
};

export type ObjectActions =
  | {
      type: 'addObject';
      payload: DataObject;
    }
  | {
      type: 'updateObject';
      payload: DataObject;
    };

const objectReducer = (state: ObjectStateType, action: ObjectActions) => {
  switch (action.type) {
    case 'addObject':
      state.objects.push(action.payload);
      return state;

    // case 'updateObject':
    //   return action.payload;

    default:
      return state;
  }
};

type ObjectContextProps = {
  objectState: ObjectStateType;
  objectDispatch: Dispatch<ObjectActions>;
};

export const ObjectContext = createContext<ObjectContextProps>(
  {} as ObjectContextProps
);

type ObjectProviderProps = {
  children: ReactNode | ReactNode[];
};

export const ObjectProvider = ({ children }: ObjectProviderProps) => {
  const [objectState, objectDispatch] = useReducer(
    objectReducer,
    objectInitialState
  );
  return (
    <ObjectContext.Provider value={{ objectState, objectDispatch }}>
      {children}
    </ObjectContext.Provider>
  );
};
