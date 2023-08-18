import { Roi } from '../types/Roi';

export function roiTemplate<T>(
  id: string,
  options: Omit<Partial<Roi<T>>, 'id'> = {},
): Roi<T> {
  return {
    id,
    style: {
      fill: 'black',
      opacity: 0.5,
    },
    editStyle: {
      fill: 'blue',
      opacity: 0.5,
    },
    action: 'idle',
    actionData: {
      startPoint: undefined,
      endPoint: undefined,
      delta: undefined,
      pointerIndex: undefined,
    },
    ...options,
  };
}
