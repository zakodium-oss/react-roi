import { use } from 'react';

import { ContainerInteractionsContext } from '../context/contexts.js';

export function useContainerInteractions() {
  return use(ContainerInteractionsContext);
}
