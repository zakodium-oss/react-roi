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

export function InitialZoomLevel() {
  return (
    <Layout>
      <p>With initial zoom level of 0.8</p>
      <RoiProvider
        initialConfig={{
          zoom: { initial: { scale: 0.8, origin: 'center' } },
        }}
      >
        <RoiContainer
          target={<TargetImage src="/barbara.jpg" />}
          style={{ border: 'solid 1px red' }}
        >
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
