import type { Meta } from '@storybook/react-vite';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Edge cases',
} as Meta;

export function Scroll() {
  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <div>Scroll down to the react-roi component</div>
      <div style={{ height: 1000 }} />
      <Layout>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
