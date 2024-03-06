import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'ROI selection',
} as Meta;

export function InitialSelectedRoi() {
  const initialRois = getInitialRois(320, 320);
  return (
    <Layout>
      <RoiProvider
        initialConfig={{ rois: initialRois, selectedRoiId: initialRois[2].id }}
      >
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

export function NoUnselection() {
  const initialRois = getInitialRois(320, 320);
  return (
    <Layout>
      <RoiProvider
        initialConfig={{ rois: initialRois, selectedRoiId: initialRois[2].id }}
      >
        <RoiContainer target={<TargetImage src="/barbara.jpg" />} noUnselection>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
