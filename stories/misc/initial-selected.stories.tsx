import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function InitialSelectedRoi() {
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
