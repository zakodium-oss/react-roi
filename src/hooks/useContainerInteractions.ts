import { useContext } from 'react';

import { containerInteractionsContext } from '../context/contexts.js';

export function useContainerInteractions() {
  return useContext(containerInteractionsContext);
}
