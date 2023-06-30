import { Rectangle } from './Rectangle';

export type DataObject = {
  id: string | number;
  rectangle: Rectangle;
  options?: {
    type: string;
    label?: string;
    fill?: number[];
  };
};
