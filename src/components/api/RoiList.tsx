import { CSSProperties } from 'react';

import { useRoiState } from '../../hooks';
import { useRois } from '../../hooks/useRois';
import { Roi } from '../../types/Roi';
import { assert } from '../../utilities/assert';

import { RoiBox } from './RoiBox';

interface StyleProperties {
  /**
   * Classname of the ROI box when not being selected or edited
   */
  className?: string;
  /**
   * Style of the ROI box when not being selected or edited.
   */
  style?: CSSProperties;
}

export interface RoiListProps<TData = unknown> {
  getStyle?: (roi: Roi<TData>, selected: boolean) => StyleProperties;
}

export function RoiList<TData = unknown>(props: RoiListProps<TData>) {
  const { getStyle = defaultGetStyle } = props;
  const rois = useRois().slice();
  const { selectedRoi } = useRoiState();
  if (selectedRoi) {
    const index = rois.findIndex((roi) => roi.id === selectedRoi);
    assert(index !== -1, 'Selected ROI not found');
    const roi = rois.splice(index, 1)[0];
    rois.push(roi);
  }

  return (
    <>
      {rois.map((roi) => (
        <RoiBox key={roi.id} roi={roi} getStyle={getStyle} />
      ))}
    </>
  );
}

function defaultGetStyle<TData = unknown>(
  _: Roi<TData>,
  selected: boolean,
): StyleProperties {
  return {
    style: {
      color: 'white',
      backgroundColor: 'black',
      opacity: selected ? 0.2 : 0.5,
    },
  };
}
