import type { RefObject } from 'react';
import { useContext } from 'react';

import type { ActionCallbacks } from '../context/contexts.js';
import { callbacksRefContext } from '../context/contexts.js';

export default function useCallbacksRef<TData = unknown>() {
  const callbacks = useContext(callbacksRefContext);
  if (!callbacks) {
    throw new Error('useCallbacksRef must be called within an RoiProvider');
  }
  return callbacks as RefObject<ActionCallbacks<TData>>;
}
