import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { initialRois } from '../actions/utils';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

export default {
  title: 'Example',
} as Meta;

export function Scroll() {
  return (
    <RoiProvider initialRois={initialRois}>
      <div style={{ height: 500 }} />
      <Layout>
        <RoiContainer target={<Image />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
