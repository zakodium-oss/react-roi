import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { produce } from 'immer';

import { Delta } from '../types/Delta';
import { Point } from '../types/Point';
import { Ratio } from '../types/Ratio';
import { Offset } from '../types/Offset';
import { DataObject } from '../types/DataObject';
import { getRectangle } from '../utilities/getRectangle';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../utilities/getScaledRectangle';
import { dragRectangle } from '../utilities/dragRectangle';
import { checkRectangle } from '../utilities/checkRectangle';
import { getReferencePointers } from '../utilities/getReferencePointers';

export const DynamicActions = Object.freeze({
  DRAG: 'drag',
  DRAW: 'draw',
  RESIZE: 'resize',
  SLEEP: 'sleep',
});

export type DynamicActions =
  (typeof DynamicActions)[keyof typeof DynamicActions];

const dynamicInitialState: DynamicStateType = {
  action: DynamicActions.SLEEP,
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 0, y: 0 },
  ratio: { x: 1, y: 1 },
  delta: { dx: 0, dy: 0 },
  offset: { top: 0, right: 0, left: 0, bottom: 0 },
  pointerIndex: undefined,
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
  getObject: function (options: { id?: number } = {}) {
    const { id = this.objectID } = options;
    return this.objects.find((obj) => obj.id === id) as DataObject;
  },
  checkRectangle: function (options: { point?: Point } = {}) {
    const { point = this.endPoint } = options;
    return checkRectangle(
      this.startPoint as Point,
      point as Point,
      this.ratio as Ratio
    );
  },
  getMousePosition: function (event: React.MouseEvent): {
    x: number;
    y: number;
  } {
    switch (this.pointerIndex) {
      case 4:
      case 5:
        return {
          x: this.endPoint?.x || 0,
          y: event.clientY - (this.offset?.top as number),
        };
      case 6:
      case 7:
        return {
          x: event.clientX - (this.offset?.left as number) || 0,
          y: this.endPoint?.y || 0,
        };
      default:
        return {
          x: event.clientX - (this.offset?.left as number),
          y: event.clientY - (this.offset?.top as number),
        };
    }
  },
};

export type DynamicAction =
  | { type: 'setAction'; payload: DynamicActions }
  | { type: 'setDelta'; payload: Delta }
  | { type: 'setObjectID'; payload: number | undefined }
  | { type: 'setDynamicState'; payload: Partial<DynamicStateType> }
  | { type: 'setStartPoint'; payload: Point }
  | { type: 'setEndPoint'; payload: Point }
  | { type: 'setRatio'; payload: Ratio }
  | { type: 'setOffset'; payload: Offset }
  | { type: 'setPosition'; payload: { startPoint: Point; endPoint: Point } }
  | { type: 'setPointerIndex'; payload: number | undefined }
  | { type: 'addObject'; payload: number } //removeObject
  | { type: 'removeObject'; payload: number }
  | { type: 'dragRectangle'; payload: { id?: number; point: Point } }
  | { type: 'updatePosition'; payload: number }
  | { type: 'updateRectangle' }
  | {
      type: 'selectBoxAnnotation';
      payload: { id: number; event: React.MouseEvent };
    };

export const dynamicReducer = (
  state: DynamicStateType,
  action: DynamicAction
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'setAction':
        draft.action = action.payload;
        break;

      case 'setDelta':
        draft.delta = action.payload;
        break;

      case 'setObjectID':
        draft.objectID = action.payload;
        break;

      case 'setDynamicState':
        Object.assign(draft, action.payload);
        break;

      case 'setPosition':
        draft.startPoint = action.payload.startPoint;
        draft.endPoint = action.payload.endPoint;
        break;

      case 'setStartPoint':
        draft.startPoint = action.payload;
        break;

      case 'setEndPoint':
        draft.endPoint = action.payload;
        break;

      case 'setRatio':
        draft.ratio = action.payload;
        break;

      case 'setOffset':
        draft.offset = action.payload;
        break;

      case 'setPointerIndex':
        draft.pointerIndex = action.payload;
        break;

      case 'removeObject': {
        const index = draft.objects.findIndex(
          (object) => object.id === action.payload
        );
        draft.objects.splice(index, 1);
        draft.objectID = undefined;
        return;
      }

      case 'addObject': {
        const { startPoint, endPoint, ratio } = draft;
        const id = action.payload;
        draft.objects.push({
          id,
          rectangle: getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio as Ratio
          ),
        });
        draft.objectID = id;
        break;
      }

      case 'updateRectangle': {
        const object = draft.getObject();
        const { startPoint, endPoint, ratio } = draft;
        if (object) {
          object.rectangle = getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio as Ratio
          );
        }
        break;
      }

      case 'dragRectangle': {
        const { point } = action.payload;
        const object = draft.getObject();
        const scaledRectangle = getScaledRectangle(
          object.rectangle,
          draft.ratio as Ratio
        );

        const position = dragRectangle(
          scaledRectangle,
          point,
          draft.delta || { dx: 0, dy: 0 }
        );
        draft.startPoint = position.startPoint;
        draft.endPoint = position.endPoint;
      }

      case 'updatePosition': {
        const { ratio } = draft;
        const object = draft.getObject();
        const points = getReferencePointers(
          object.rectangle,
          ratio as Ratio,
          action.payload as number
        );

        draft.startPoint = {
          x: points?.p0.x ?? (draft.startPoint?.x || 0),
          y: points?.p0.y ?? (draft.startPoint?.y || 0),
        };
        draft.endPoint = {
          x: points?.p1.x ?? (draft.endPoint?.x || 0),
          y: points?.p1.y ?? (draft.endPoint?.y || 0),
        };
        break;
      }

      case 'selectBoxAnnotation': {
        const { id, event } = action.payload;
        const object = draft.getObject({ id });
        const { ratio, offset, delta } = draft;
        const scaledRectangle = getScaledRectangle(
          object.rectangle,
          ratio as Ratio
        );
        const { startPoint, endPoint } = dragRectangle(
          scaledRectangle,
          {
            x: scaledRectangle.origin.column + delta.dx,
            y: scaledRectangle.origin.row + delta.dy,
          },
          delta
        );
        draft.objectID = id;
        draft.action = DynamicActions.DRAG;
        draft.delta = {
          dx:
            event.clientX -
            scaledRectangle.origin.column -
            (offset?.left as number),
          dy:
            event.clientY -
            scaledRectangle.origin.row -
            (offset?.top as number),
        };
        draft.startPoint = startPoint;
        draft.endPoint = endPoint;
        break;
      }

      default:
        break;
    }
  });
};

type DynamicContextProps = {
  dynamicState: DynamicStateType;
  dynamicDispatch: Dispatch<DynamicAction>;
};

export const DynamicContext = createContext<DynamicContextProps>(
  {} as DynamicContextProps
);

type ObjectProviderProps = {
  children: ReactNode;
};

export const DynamicProvider = ({ children }: ObjectProviderProps) => {
  const [dynamicState, dynamicDispatch] = useReducer(
    dynamicReducer,
    dynamicInitialState
  );
  return (
    <DynamicContext.Provider value={{ dynamicState, dynamicDispatch }}>
      {children}
    </DynamicContext.Provider>
  );
};

export type DynamicStateType = {
  /**
   * @param action Current action
   */
  action: DynamicActions;

  /**
   * @param delta offset from the point where the click was made to the top-left corner of the rectangle
   */
  delta: Delta;

  /**
   * @param objectID Identification of the selected object
   */
  objectID?: number;

  /**
   * position object with the startPoint (top-left) and endPoint (bottom-right) of the rectangle
   */
  position?: number;

  /**
   * @param startPoint Point at the top-left of the rectangle.
   */
  startPoint?: Point;

  /**
   * @param endPoint Point at the bottom-right of the rectangle.
   */
  endPoint?: Point;

  /**
   * @param ratio ratio of the width and height of the image related to the window, measured in pixels
   */
  ratio?: Ratio;

  /**
   * @param offset offset information for the SVG relative to the entire window
   */
  offset?: Offset;

  /**
   * @param pointerIndex offset index of the selected pointer
   */
  pointerIndex?: number;

  /**
   * @param objects
   */

  objects: DataObject[];

  /**
   *
   */
  getObject: (options?: { id: number }) => DataObject;

  /**
   *
   */
  checkRectangle: (options?: { point: Point }) => boolean;

  /**
   *
   */
  getMousePosition: (event: React.MouseEvent) => { x: number; y: number };
};
