import { useContext } from 'react';

import { committedRoisContext } from '../context/contexts';
import { CommittedRoi } from '../types/Roi';

export function useCommittedRois<T>() {
  const committedRois = useContext(committedRoisContext);
  if (!committedRois) {
    throw new Error('useCommittedRois must be used within a RoiProvider');
  }
  return committedRois as Array<CommittedRoi<T>>;
}
