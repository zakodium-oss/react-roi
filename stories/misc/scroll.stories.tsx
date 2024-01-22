import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function Scroll() {
  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <div style={{ height: 1000 }} />
      <Layout>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
