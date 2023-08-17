import { CSSProperties } from 'react';

import { Point } from './Point';

export interface Roi<TData = unknown> {
  id: string;
  label?: string;
  action: 'resizing' | 'moving' | 'drawing' | 'idle';
  actionData?: {
    startPoint?: Point;
    endPoint?: Point;
    delta?: Point;
    pointerIndex?: number;
  };
  style: CSSProperties;
  editStyle: CSSProperties;
  data?: TData;
}
