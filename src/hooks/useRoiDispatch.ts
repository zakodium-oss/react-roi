import { useContext } from 'react';

import { roiDispatchContext } from '../context/contexts';

export function useRoiDispatch() {
  const roiDispatch = useContext(roiDispatchContext);
  if (!roiDispatch) {
    throw new Error(
      'roiDispatchContext is not defined, please check if you are using RoiProvider',
    );
  }
  return roiDispatch;
}
