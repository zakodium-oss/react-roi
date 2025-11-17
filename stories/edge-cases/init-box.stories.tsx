import type { Meta } from '@storybook/react-vite';

import type { CommittedRoiProperties } from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { CommittedRoisButton } from '../utils/CommittedRoisButton.tsx';
import { Layout } from '../utils/Layout.tsx';

export default {
  title: 'Edge cases',
} as Meta;
const width = 320;
const height = 320;
const initialRois: CommittedRoiProperties[] = [
  {
    id: '0000-1111-2222-3333',
    x: 0.1 * width + Math.random(),
    y: 0.1 * height + Math.random(),
    width: 0.2 * width + Math.random(),
    height: 0.2 * height + Math.random(),
    label: 'Roi A',
    angle: 0,
  },
  {
    id: '1111-2222-3333-4444',
    x: 0.7 * width + Math.random(),
    y: 0.2 * height + Math.random(),
    width: 0.2 * width + Math.random(),
    height: 0.2 * height + Math.random(),
    label: 'Roi B',
    angle: (Math.random() * Math.PI) / 4,
  },
  {
    id: '2222-3333-4444-5555',
    x: 0.6 * width + Math.random(),
    y: 0.75 * height + Math.random(),
    width: 0.2 * width + Math.random(),
    height: 0.2 * height + Math.random(),
    label: 'Roi C',
    angle: (-Math.random() * Math.PI) / 4,
  },
];

export function RoundInitialValues() {
  return (
    <RoiProvider
      initialConfig={{ rois: initialRois, commitRoiBoxStrategy: 'round' }}
    >
      <Layout>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList displayRotationHandle />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton showImage={false} isDefaultShown />
    </RoiProvider>
  );
}
