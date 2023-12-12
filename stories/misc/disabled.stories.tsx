import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';

export default {
  title: 'Misc',
} as Meta;

export function DisableZoom() {
  return (
    <Layout>
      <RoiProvider>
        <RoiContainer lockZoom target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
