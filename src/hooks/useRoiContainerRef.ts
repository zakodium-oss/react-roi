import { useContext } from 'react';

import { roiContainerRefContext } from '../context/contexts.js';

export function useRoiContainerRef() {
  const container = useContext(roiContainerRefContext);
  return container;
}
