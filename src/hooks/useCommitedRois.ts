import { useContext } from 'react';

import { commitedRoisContext } from '../context/contexts';
import { CommittedRoi } from '../types/CommittedRoi';

export function useCommitedRois<T>() {
  const commitedRois = useContext(commitedRoisContext);
  if (!commitedRois) {
    throw new Error('useCommitedRois must be used within a RoiProvider');
  }
  return commitedRois as Array<CommittedRoi<T>>;
}
