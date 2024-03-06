import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';

export default {
  title: 'Pan and zoom',
} as Meta;

export function InitialZoomLevel() {
  return (
    <Layout>
      <RoiProvider
        initialConfig={{
          zoom: { initial: { scale: 1.4, translation: [0, 0] } },
        }}
      >
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
