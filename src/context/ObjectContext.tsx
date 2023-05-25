import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { produce } from 'immer';

import { Rectangle } from '../types/Rectangle';
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
      type: 'updateRectangle';
      payload: { id: number | string; rectangle: Rectangle };
    }
  | {
      type: 'updateSelection';
      payload: { id: number | string; selected: boolean };
    }
  | {
      type: 'resetSelection';
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

      case 'updateSelection': {
        const { id, selected } = action.payload;
        draft.objects.forEach((obj) => {
          obj.selected = obj.id === id ? selected : false;
        });
        break;
      }

      case 'resetSelection': {
        draft.objects.forEach((obj) => {
          obj.selected = false;
        });
        break;
      }

      default:
        break;
    }
  });
};

type ObjectContextProps = {
  objectState: ObjectStateType;
  objectDispatch: Dispatch<ObjectActions>;
};

export const ObjectContext = createContext<ObjectContextProps>(
  {} as ObjectContextProps
);

type ObjectProviderProps = {
  children: ReactNode;
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
