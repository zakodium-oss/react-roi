import { CommittedRoiProperties } from '../../src';

export function getInitialRois<T>(
  width: number,
  height: number,
  data?: T,
): Array<CommittedRoiProperties<T>> {
  return [
    {
      id: '0000-1111-2222-3333',
      x: 0,
      y: 0,
      width: Math.floor(0.2 * width),
      height: Math.floor(0.2 * height),
      label: 'Roi A',
      angle: 0,
      data,
    },
    {
      id: '1111-2222-3333-4444',
      x: Math.floor(0.3 * width),
      y: 0,
      width: Math.floor(0.2 * width),
      height: Math.floor(0.2 * height),
      label: 'Roi B',
      angle: 0,
      data,
    },
    {
      id: '2222-3333-4444-5555',
      x: Math.floor(0.5 * width),
      y: Math.floor(0.5 * height),
      width: Math.floor(0.2 * width),
      height: Math.floor(0.1 * height),
      label: 'Roi C',
      angle: 0,
      data,
    },
  ];
}
