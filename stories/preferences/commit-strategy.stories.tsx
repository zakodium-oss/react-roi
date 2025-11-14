import type { Meta } from '@storybook/react-vite';

import type { CommitBoxStrategy } from '../../src/context/roiReducer.ts';
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
    commitStrategy: 'exact',
    displayRotationHandle: false,
  },
  argTypes: {
    commitStrategy: {
      options: ['exact', 'round'] as const satisfies CommitBoxStrategy[],
      control: {
        type: 'select',
      },
    },
  },
} as Meta;

interface StoryProps {
  commitStrategy: CommitBoxStrategy;
  displayRotationHandle: boolean;
}

export function CommitStrategy(props: StoryProps) {
  const initialRois = getInitialRois(320, 320);
  return (
    <RoiProvider
      key={props.commitStrategy}
      initialConfig={{
        rois: initialRois,
        commitRoiBoxStrategy: props.commitStrategy,
      }}
    >
      <Layout>
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList displayRotationHandle={props.displayRotationHandle} />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton showImage={false} />
    </RoiProvider>
  );
}
