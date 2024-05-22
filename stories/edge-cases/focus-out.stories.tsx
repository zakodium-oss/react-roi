import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';

export default {
  title: 'Edge cases',
} as Meta;

export function FocusOut() {
  return (
    <Layout>
      <RoiProvider>
        <p>When interacting with react-roi, the focus should leave the input</p>
        <input type="text" />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
