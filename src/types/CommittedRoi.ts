import { Roi } from './Roi';

export interface CommittedRoi<TData = any>
  extends Omit<Roi<TData>, 'action' | 'actionData'> {
  x: number;
  y: number;
  width: number;
  height: number;
}
