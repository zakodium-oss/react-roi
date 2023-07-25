import { Roi } from "./Roi";

export interface CommittedRoi<TData = unknown> extends Omit<Roi<TData>, 'isMoving' | 'isResizing'> { }