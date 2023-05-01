import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Rectangle } from "../types/Rectangle";

export type DragObject = {
  id: string | number;
  selected: boolean;
  rectangle: Rectangle;
};

type DragState = {
  objects: DragObject[];
};

const dragContext: DragState = {
  objects: [],
};

type DragContextProps = {
  state: DragState;
  dispatch: Dispatch<Actions>;
};

export const DragContext = createContext({} as DragContextProps);

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

type Actions = {
  type: "addDragObject";
  payload: DragObject;
};

export const dataReducer = (state: DragState, action: Actions) => {
  switch (action.type) {
    case "addDragObject":
      console.log("-------------", action.type);
      state.objects.push(action.payload);
      return state;

    default:
      return state;
  }
};
