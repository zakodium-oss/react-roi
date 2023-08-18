import { useContext } from 'react';

import { CommitedRoisContext } from '../context/RoiContext';
import { CommittedRoi } from '../types/CommittedRoi';

export function useCommitedRois<T>(ids?: string[]) {
  const commitedRois = useContext<Array<CommittedRoi<T>>>(CommitedRoisContext);
  // TODO: show error if context do not exist
  if (ids) {
    return commitedRois.filter((roi) => ids.includes(roi.id));
  } else {
    return commitedRois;
  }
}
