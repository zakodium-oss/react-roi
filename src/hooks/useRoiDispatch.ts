import { useContext } from 'react';

import { RoiDispatchContext } from '../context/contexts.js';

export function useRoiDispatch() {
  const roiDispatch = useContext(RoiDispatchContext);
  if (!roiDispatch) {
    throw new Error(
      'roiDispatchContext is not defined, please check if you are using RoiProvider',
    );
  }
  return roiDispatch;
}
