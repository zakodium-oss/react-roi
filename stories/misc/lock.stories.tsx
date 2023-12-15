import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function LockZoom() {
  return (
    <Layout>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: initialRois }}>
          <RoiContainer lockZoom target={<TargetImage src="/barbara.jpg" />}>
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}

export function LockPan() {
  return (
    <Layout>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: initialRois }}>
          <RoiContainer lockPan target={<TargetImage src="/barbara.jpg" />}>
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}
