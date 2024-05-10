import { useContext } from 'react';

import { committedRoisContext } from '../context/contexts';
import { CommittedRoi } from '../types/CommittedRoi';

export function useCommittedRois<T>() {
  const committedRois = useContext(committedRoisContext);
  if (!committedRois) {
    throw new Error('useCommittedRois must be used within a RoiProvider');
  }
  return committedRois.map((roi) => {
    return new CommittedRoi(roi) as CommittedRoi<T>;
  });
}
