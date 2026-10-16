import { use } from 'react';

import { CommittedRoisContext } from '../context/contexts.js';
import { CommittedRoi } from '../types/CommittedRoi.js';

export function useCommittedRois<T>() {
  const committedRois = use(CommittedRoisContext);
  if (!committedRois) {
    throw new Error('useCommittedRois must be used within a RoiProvider');
  }
  return committedRois.map((roi) => {
    return new CommittedRoi(roi) as CommittedRoi<T>;
  });
}
