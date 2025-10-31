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

export function DrawReadOnlyAndEditable() {
  const initialRois = getInitialRois(320, 320);
  return (
    <RoiProvider initialConfig={{ rois: initialRois, mode: 'draw' }}>
      <Layout>
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList
            getReadOnly={(roi) => roi.id === initialRois[2].id}
            getStyle={(roi) => ({
              rectAttributes: {
                fill: roi.id === initialRois[2].id ? 'red' : 'gray',
              },
            })}
          />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
