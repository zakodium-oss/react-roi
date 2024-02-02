import { RefObject, useContext } from 'react';

import { ActionCallbacks, callbacksRefContext } from '../context/contexts';

export default function useCallbacksRef<TData = unknown>() {
  const callbacks = useContext(callbacksRefContext);
  if (!callbacks) {
    throw new Error('useCallbacksRef must be called within an RoiProvider');
  }
  return callbacks as RefObject<ActionCallbacks<TData>>;
}
