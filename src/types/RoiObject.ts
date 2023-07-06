import { Rectangle } from './Rectangle';

export type RoiObject = {
  id: string;
  rectangle: Rectangle;
  meta?: {
    type?: string;
    label?: string;
    rgba?: number[];
  };
};
