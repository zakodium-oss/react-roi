import { useContext, useEffect } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';
import { RoiObject } from '../types';

export function useAddRois(rois: Omit<RoiObject, 'id'>[]): void {
  const { roiDispatch } = useContext(RoiDispatchContext);
  useEffect(() => {
    roiDispatch({ type: 'addRois', payload: rois });
  }, [roiDispatch, rois]);
}
