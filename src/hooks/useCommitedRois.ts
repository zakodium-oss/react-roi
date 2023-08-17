import { useContext } from 'react';

import { CommitedRoisContext } from '../context/RoiContext';
import { CommittedRoi } from '../types/CommittedRoi';

export function useCommitedRois<T>() {
  const commitedRois = useContext<Array<CommittedRoi<T>>>(CommitedRoisContext);
  // TODO: show error if context do not exist
  return commitedRois;
}
