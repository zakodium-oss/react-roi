import { useRois } from '../../hooks';

import { RoiBox } from './RoiBox';

export function RoiList() {
  const rois = useRois();
  return (
    <>
      {rois.map((roi) => (
        <RoiBox key={roi.id} roi={roi} />
      ))}
    </>
  );
}
