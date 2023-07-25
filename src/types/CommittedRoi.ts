import { Roi } from "./Roi";

export type CommittedRoi<TData = unknown> = Omit<
  Roi<TData>,
  'isMoving' | 'isResizing'
>;