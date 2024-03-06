import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Roi } from '../../src/types/Roi';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Edge cases',
} as Meta;

export function canInteractThroughReadOnlyRoi() {
  const initialRois = getInitialRois(320, 320);
  function getReadOnly(roi: Roi) {
    return roi.id === initialRois[0].id;
  }

  function getStyle(roi: Roi) {
    return {
      rectAttributes: {
        fill: roi.id === initialRois[0].id ? 'darkgreen' : 'red',
        opacity: roi.id === initialRois[0].id ? 0.4 : 0.6,
      },
    };
  }

  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getReadOnly={getReadOnly} getStyle={getStyle} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
