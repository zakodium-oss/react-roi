import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Rectangle } from '../types/Rectangle';

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
  return (
    <DragContext.Provider value={{ state, dispatch }}>
      {children}
    </DragContext.Provider>
  );
};

type Actions =
  | {
      type: 'addDragObject';
      payload: DragObject;
    }
  | {
      type: 'updateState';
      payload: DragState;
    };

export const dataReducer = (state: DragState, action: Actions) => {
  switch (action.type) {
    case 'addDragObject':
      state.objects.push(action.payload);
      return state;

    case 'updateState':
      return action.payload;

    default:
      return state;
  }
};
