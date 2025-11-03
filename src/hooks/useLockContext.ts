import { useContext } from 'react';

import { lockContext } from '../context/contexts.js';

export function useLockContext() {
  const ctx = useContext(lockContext);
  return ctx;
}
