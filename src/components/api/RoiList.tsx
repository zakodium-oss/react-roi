import { SVGAttributes } from 'react';

import { useRoiState } from '../../hooks';
import { useRois } from '../../hooks/useRois';
import { Roi } from '../../types/Roi';
import { assert } from '../../utilities/assert';
import { RoiBox } from '../box/RoiBox';

export interface RoiGetStyleState {
  isSelected: boolean;
  isReadOnly: boolean;
  scale: number;
}

export interface RoiListProps<TData = unknown> {
  getStyle?: (
    roi: Roi<TData>,
    roiAdditionalState: RoiGetStyleState,
  ) => SVGAttributes<SVGRectElement>;
  getReadOnly?: (roi: Roi<TData>) => boolean;
}

export function RoiList<TData = unknown>(props: RoiListProps<TData>) {
  const { getStyle = defaultGetStyle, getReadOnly = () => false } = props;
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
        <RoiBox
          key={roi.id}
          roi={roi}
          getStyle={getStyle}
          getReadOnly={getReadOnly}
        />
      ))}
    </>
  );
}

const defaultGetStyle: RoiListProps['getStyle'] = (roi, state) => {
  return {
    fill: state.isReadOnly
      ? 'rgba(0,0,0,0.6)'
      : state.isSelected
        ? 'transparent'
        : 'rgba(0,0,0,0.4)',
    stroke: state.isSelected ? '#202020' : 'transparent',
    strokeWidth: 0,
  };
};
