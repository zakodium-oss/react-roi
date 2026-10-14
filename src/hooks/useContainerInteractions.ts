import { useContext } from 'react';

import { containerInteractionsContext } from '../context/contexts.js';

/**
 * The resolved interactions allowed on the enclosing RoiContainer.
 */
export function useContainerInteractions() {
  return useContext(containerInteractionsContext);
}
