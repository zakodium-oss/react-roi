import { Rectangle } from './Rectangle';

export type RoiObject = {
  id: string | number;
  rectangle: Rectangle;
  meta?: {
    label?: string;
    rgba?: number[];
  };
};
