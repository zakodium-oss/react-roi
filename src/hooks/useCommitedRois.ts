import { useContext } from 'react';

import { committedRoisContext } from '../context/contexts';
import { CommittedRoi } from '../types/Roi';

export function useCommitedRois<T>() {
  const commitedRois = useContext(committedRoisContext);
  if (!commitedRois) {
    throw new Error('useCommitedRois must be used within a RoiProvider');
  }
  return commitedRois as Array<CommittedRoi<T>>;
}
