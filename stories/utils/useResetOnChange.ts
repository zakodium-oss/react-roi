import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useResetOnChange(dependencies: any[]) {
  const [keyId, setKeyId] = useState(() => v4());
  useEffect(() => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    setKeyId(v4());
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, dependencies);
  return keyId;
}
