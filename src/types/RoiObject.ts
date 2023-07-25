import { Rectangle } from './Rectangle';

export interface RoiObject {
  id: string;
  rectangle: Rectangle;
  meta?: {
    type?: string;
    label?: string;
    rgba?: number[];
  };
}
