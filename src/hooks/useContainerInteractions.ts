import { useContext } from 'react';

import { ContainerInteractionsContext } from '../context/contexts.js';

export function useContainerInteractions() {
  return useContext(ContainerInteractionsContext);
}
