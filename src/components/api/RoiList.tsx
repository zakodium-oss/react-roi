import { useRoiState, useRois } from '../../hooks';

import { RoiBox } from './RoiBox';

export function RoiList() {
  const rois = useRois().slice();
  const { selectedRoi } = useRoiState();
  if (selectedRoi) {
    const index = rois.findIndex((roi) => roi.id === selectedRoi);
    const roi = rois.splice(index, 1)[0];
    rois.push(roi);
  }
  return (
    <>
      {rois.map((roi) => (
        <RoiBox key={roi.id} roi={roi} />
      ))}
    </>
  );
}
