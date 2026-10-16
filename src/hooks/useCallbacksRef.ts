import type { RefObject } from 'react';
import { use } from 'react';

import type { ActionCallbacks } from '../context/contexts.js';
import { CallbacksRefContext } from '../context/contexts.js';

export default function useCallbacksRef<TData = unknown>() {
  const callbacks = use(CallbacksRefContext);
  if (!callbacks) {
    throw new Error('useCallbacksRef must be called within an RoiProvider');
  }
  return callbacks as RefObject<ActionCallbacks<TData>>;
}
