import { Roi } from './Roi';

export interface CommittedRoi<TData = unknown>
  extends Omit<Roi<TData>, 'action' | 'actionData'> {
  x: number;
  y: number;
  width: number;
  height: number;
}
