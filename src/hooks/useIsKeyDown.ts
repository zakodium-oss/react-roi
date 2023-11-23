import { useEffect, useState } from 'react';

export function useIsKeyDown(key: string) {
  const [isKeyDown, setIsKeyDown] = useState(false);
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key) {
        setIsKeyDown(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === key) {
        setIsKeyDown(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [key]);
  return isKeyDown;
}
