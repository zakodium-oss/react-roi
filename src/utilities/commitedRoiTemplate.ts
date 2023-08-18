import { CommittedRoi } from '../types/CommittedRoi';

export function commitedRoiTemplate<T>(
  id: string,
  options: Omit<Partial<CommittedRoi<T>>, 'id'> = {},
): CommittedRoi<T> {
  return {
    id,
    label: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    style: {
      fill: 'black',
      opacity: 0.5,
    },
    editStyle: {
      fill: 'blue',
      opacity: 0.5,
    },
    ...options,
  };
}
