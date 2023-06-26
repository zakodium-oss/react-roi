import { createContext, Dispatch, ReactNode, useReducer } from 'react';
<<<<<<< HEAD
import { produce } from 'immer';

import { Rectangle } from '../types/Rectangle';
=======
import { Rectangle } from '../types/Rectangle';
import {
  EventActions,
  eventReducer,
  EventStateType,
  intialEventState,
} from './EventReducer';
>>>>>>> main
import { DataObject } from '../types/DataObject';

export type ObjectStateType = {
  objects: DataObject[];
};

const objectInitialState: ObjectStateType = {
<<<<<<< HEAD
  objects: [
    {
      id: 0.08787081976685629,
      rectangle: { origin: { row: 152, column: 369 }, width: 83, height: 15 },
    },
    {
      id: 0.5108332018722821,
      rectangle: { origin: { row: 193, column: 343 }, width: 34, height: 15 },
    },
    {
      id: 0.05981619466014365,
      rectangle: { origin: { row: 295, column: 346 }, width: 115, height: 32 },
    },
    {
      id: 0.3942252292733659,
      rectangle: { origin: { row: 83, column: 685 }, width: 72, height: 33 },
    },
  ],
=======
  objects: [],
>>>>>>> main
};

export type ObjectActions =
  | {
      type: 'addObject';
      payload: DataObject;
    }
  | {
<<<<<<< HEAD
      type: 'updateRectangle';
      payload: { id: number | string; rectangle: Rectangle };
    };

const objectReducer = (state: ObjectStateType, action: ObjectActions) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'addObject':
        draft.objects.push(action.payload);
        break;

      case 'updateRectangle': {
        const { id, rectangle } = action.payload;
        const object = draft.objects.find((obj) => obj.id === id);
        if (object) {
          object.rectangle = rectangle;
        }
        break;
      }

      default:
        break;
    }
  });
=======
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
>>>>>>> main
};

type ObjectContextProps = {
  objectState: ObjectStateType;
  objectDispatch: Dispatch<ObjectActions>;
};

export const ObjectContext = createContext<ObjectContextProps>(
  {} as ObjectContextProps
);

type ObjectProviderProps = {
<<<<<<< HEAD
  children: ReactNode;
=======
  children: ReactNode | ReactNode[];
>>>>>>> main
};

export const ObjectProvider = ({ children }: ObjectProviderProps) => {
  const [objectState, objectDispatch] = useReducer(
    objectReducer,
    objectInitialState
  );
<<<<<<< HEAD

=======
>>>>>>> main
  return (
    <ObjectContext.Provider value={{ objectState, objectDispatch }}>
      {children}
    </ObjectContext.Provider>
  );
};
