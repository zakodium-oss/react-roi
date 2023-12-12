import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function DisableZoom() {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <RoiContainer lockZoom target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

export function DisablePan() {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <RoiContainer lockPan target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
