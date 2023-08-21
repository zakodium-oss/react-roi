import { useContext } from 'react';

import { roiContainerRefContext } from '../context/contexts';

export function useRoiContainerRef() {
  const container = useContext(roiContainerRefContext);
  return container;
}
