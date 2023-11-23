import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useResetOnChange(deps: any[]) {
  const [keyId, setKeyId] = useState(v4());
  useEffect(() => {
    setKeyId(v4());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return keyId;
}
