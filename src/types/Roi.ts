import { CSSProperties } from 'react';

export interface Roi<TData = unknown> {
  id: string;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMoving: boolean;
  isResizing: boolean;
  style: CSSProperties;
  editStyle: CSSProperties;
  data?: TData;
}