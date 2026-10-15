import { useContext } from 'react';

import { RoiContainerRefContext } from '../context/contexts.js';

export function useRoiContainerRef() {
  const container = useContext(RoiContainerRefContext);
  return container;
}
