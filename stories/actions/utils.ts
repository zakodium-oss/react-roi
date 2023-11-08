import { CommittedRoi } from '../../src/types/Roi';

export const initialRois: Array<CommittedRoi> = [
  {
    id: '0000-1111-2222-3333',
    x: 0,
    y: 0,
    width: 0.2,
    height: 0.2,
    label: 'A',
  },
  {
    id: '1111-2222-3333-4444',
    x: 0.3,
    y: 0,
    width: 0.2,
    height: 0.2,
    label: 'B',
  },
  {
    id: '2222-3333-4444-5555',
    x: 0,
    y: 0.3,
    width: 0.3,
    height: 0.3,
    label: 'C',
  },
];
