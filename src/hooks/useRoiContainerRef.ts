import { use } from 'react';

import { RoiContainerRefContext } from '../context/contexts.js';

export function useRoiContainerRef() {
  return use(RoiContainerRefContext);
}
