// import { Dispatch, ReactNode, createContext, useReducer } from 'react';
// import { Delta } from '../types/Delta';
// import { Point } from '../types/Point';
// import { Ratio } from '../types/Ratio';

// export type PositionStateType = {
//   startPoint: Point;
//   endPoint: Point;
//   delta: Ratio;
// };

// export type PositionAction =
//   | {
//       type: 'setStartPoint';
//       payload: Point;
//     }
//   | {
//       type: 'setEndPoint';
//       payload: Point;
//     }
//   | {
//       type: 'setPosition';
//       payload: {
//         startPoint: Point;
//         endPoint: Point;
//       };
//     }
//   | {
//       type: 'setRatio';
//       payload: Ratio;
//     };

// const positionReducer = (state: PositionStateType, action: PositionAction) => {
//   switch (action.type) {
//     case 'setStartPoint':
//       return {
//         ...state,
//         startPoint: action.payload,
//       };

//     case 'setEndPoint':
//       return {
//         ...state,
//         endPoint: action.payload,
//       };

//     case 'setPosition':
//       return {
//         ...state,
//         ...action.payload,
//       };

//     case 'setRatio':
//       return {
//         ...state,
//         delta: action.payload,
//       };
//   }
// };

// const initialPositionState: PositionStateType = {
//   startPoint: { x: 0, y: 0 },
//   endPoint: { x: 0, y: 0 },
//   delta: { x: 1, y: 1 },
// };

// type PositionContextProps = {
//   positionState: PositionStateType;
//   positionDispatch: Dispatch<PositionAction>;
// };

// export const PositionContext = createContext<PositionContextProps>(
//   {} as PositionContextProps
// );

// type PositionProviderProps = {
//   children: ReactNode | ReactNode[];
// };

// export const PositionProvider = ({ children }: PositionProviderProps) => {
//   const [positionState, positionDispatch] = useReducer(
//     positionReducer,
//     initialPositionState
//   );
//   return (
//     <PositionContext.Provider value={{ positionState, positionDispatch }}>
//       {children}
//     </PositionContext.Provider>
//   );
// };
