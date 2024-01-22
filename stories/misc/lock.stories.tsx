import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function LockZoom() {
  return (
    <Layout>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
          <RoiContainer lockZoom target={<TargetImage src="/barbara.jpg" />}>
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}

export function LockPan() {
  const initialRois = getInitialRois(320, 320);
  return (
    <Layout>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: initialRois }}>
          <RoiContainer lockPan target={<TargetImage src="/barbara.jpg" />}>
            <RoiList getReadOnly={(roi) => roi.id === initialRois[2].id} />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}
