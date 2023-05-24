import { createContext, Dispatch, ReactNode, useReducer } from 'react';
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
  switch (action.type) {
    case 'addObject':
      state.objects.push(action.payload);
      return state;

    case 'updateRectangle': {
      let { id, rectangle } = action.payload;
      const objectIndex = state.objects.findIndex((obj) => obj.id === id);
      const currentObject = state.objects[objectIndex];
      currentObject.rectangle = rectangle;
      state.objects[objectIndex] = currentObject;
      return state;
    }

    case 'updateSelection': {
      for (let i = 0; i < state.objects.length; i++) {
        state.objects[i].selected = false;
      }
      const { id, selected } = action.payload;
      const objectIndex = state.objects.findIndex((obj) => obj.id === id);
      const currentObject = state.objects[objectIndex];
      currentObject.selected = selected || false;
      state.objects[objectIndex] = currentObject;
      return state;
    }

    case 'resetSelection': {
      for (let i = 0; i < state.objects.length; i++) {
        state.objects[i].selected = false;
      }
      return state;
    }

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
