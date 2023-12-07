import { CSSProperties, ReactNode, SVGAttributes } from 'react';

import { useRoiState } from '..';
import { useRois } from '../hooks/useRois';
import { Roi } from '../types/Roi';
import { assert } from '../utilities/assert';

import { RoiBox } from './box/RoiBox';
import { CornerSizeOptions } from './box/sizes';

export interface RoiAdditionalCallbackState {
  isSelected: boolean;
  isReadOnly: boolean;
  scaledSizes: CornerSizeOptions;
}

interface CustomRoiStyle {
  rectAttributes?: SVGAttributes<SVGRectElement>;
  resizeHandlerColor?: CSSProperties['color'];
}

export interface RoiListProps<TData = unknown> {
  getStyle?: (
    roi: Roi<TData>,
    roiAdditionalState: RoiAdditionalCallbackState,
  ) => CustomRoiStyle;
  getReadOnly?: (roi: Roi<TData>) => boolean;
  renderLabel?: (
    roi: Roi<TData>,
    roiAdditionalState: RoiAdditionalCallbackState,
  ) => ReactNode;
}

export function RoiList<TData = unknown>(props: RoiListProps<TData>) {
  const {
    getStyle = defaultGetStyle,
    getReadOnly = () => false,
    renderLabel = defaultRenderLabel,
  } = props;
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
          renderLabel={renderLabel}
          getReadOnly={getReadOnly}
          isSelected={roi.id === selectedRoi}
        />
      ))}
    </>
  );
}

const defaultGetStyle: RoiListProps['getStyle'] = (roi, state) => {
  return {
    rectAttributes: {
      fill: state.isReadOnly
        ? 'rgba(0,0,0,0.6)'
        : state.isSelected
          ? 'rgba(0,0,0,0.2)'
          : 'rgba(0,0,0,0.4)',
    },
    resizeHandlerColor: 'black',
  };
};

const defaultRenderLabel: RoiListProps['renderLabel'] = (roi) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        placeContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      {roi.label}
    </div>
  );
};
