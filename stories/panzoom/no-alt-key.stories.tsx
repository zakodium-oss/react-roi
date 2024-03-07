import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';

export default {
  title: 'Pan and zoom',
} as Meta;

export function ZoomWithoutAltKey() {
  return (
    <Layout>
      <RoiProvider>
        <RoiContainer
          target={<TargetImage src="/barbara.jpg" />}
          zoomWithoutAltKey
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
            zoomWithoutAltKey
          >
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </Layout>
      <div style={{ height: 400 }} />
    </>
  );
}
