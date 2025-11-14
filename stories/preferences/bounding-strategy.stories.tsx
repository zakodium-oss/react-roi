import type { Meta } from '@storybook/react-vite';

import type { BoundaryStrategy } from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { CommittedRoisButton } from '../utils/CommittedRoisButton.tsx';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Preferences',
  args: {
    commitRoiBoundaryStrategy: 'inside_auto',
    allowRotate: false,
  },
  argTypes: {
    commitRoiBoundaryStrategy: {
      options: [
        'inside_auto',
        'inside',
        'partially_inside',
        'none',
      ] as const satisfies BoundaryStrategy[],
      control: {
        type: 'select',
      },
    },
  },
} as Meta;

export function CommitBoundaryStrategy(props: {
  commitRoiBoundaryStrategy: BoundaryStrategy;
  allowRotate: boolean;
}) {
  const initialRois = getInitialRois(320, 320);
  return (
    <RoiProvider
      key={props.commitRoiBoundaryStrategy}
      initialConfig={{
        rois: initialRois,
        zoom: {
          min: 0.1,
        },
        commitRoiBoundaryStrategy: props.commitRoiBoundaryStrategy,
      }}
    >
      <Layout>
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList allowRotate={props.allowRotate} />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton />
    </RoiProvider>
  );
}
