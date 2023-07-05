import { Rectangle } from './Rectangle';

export type RoiObject = {
  id: string;
  rectangle: Rectangle;
  meta?: {
    label?: string;
    rgba?: number[];
  };
};
