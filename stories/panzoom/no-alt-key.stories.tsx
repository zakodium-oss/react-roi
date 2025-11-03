import type { Meta } from '@storybook/react-vite';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { Layout } from '../utils/Layout.tsx';

export default {
  title: 'Pan and zoom',
} as Meta;

export function ZoomWithoutAltKey() {
  return (
    <Layout>
      <RoiProvider>
        <RoiContainer
          target={<TargetImage src="/barbara.jpg" />}
          zoomWithoutModifierKey
        >
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

export function ZoomWithoutAltKeyScroll() {
  return (
    <>
      <div style={{ height: 400 }} />
      <Layout>
        <RoiProvider>
          <RoiContainer
            target={<TargetImage src="/barbara.jpg" />}
            zoomWithoutModifierKey
          >
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </Layout>
      <div style={{ height: 400 }} />
    </>
  );
}
