import { useContext } from 'react';

import { commitedRoisContext } from '../context/contexts';
import { CommittedRoi } from '../types/CommittedRoi';

export function useCommitedRois<T>(ids?: string[]) {
  const commitedRois = useContext<Array<CommittedRoi<T>>>(commitedRoisContext);
  // TODO: show error if context do not exist
  if (ids) {
    return commitedRois.filter((roi) => ids.includes(roi.id));
  } else {
    return commitedRois;
  }
}
