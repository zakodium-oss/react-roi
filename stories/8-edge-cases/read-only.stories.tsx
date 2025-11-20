import type { Meta } from '@storybook/react-vite';

import type { GetReadOnlyCallback, GetStyleCallback } from '../../src/index.ts';
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

export function canInteractThroughReadOnlyRoi() {
  const initialRois = getInitialRois(320, 320);
  const getReadOnly: GetReadOnlyCallback = ({ id }) => {
    return id === initialRois[0].id;
  };

  const getStyle: GetStyleCallback = ({ id }) => {
    return {
      rectAttributes: {
        fill: id === initialRois[0].id ? 'darkgreen' : 'red',
        opacity: id === initialRois[0].id ? 0.4 : 0.6,
      },
    };
  };

  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getReadOnly={getReadOnly} getStyle={getStyle} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
