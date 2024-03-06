import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { CommitBoxStrategy } from '../../src/context/roiReducer';
import { CommittedRoisButton } from '../utils/CommittedRoisButton';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Preferences',
  args: {
    commitStrategy: 'exact',
    allowRotate: false,
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

export function CommitStrategy(props: {
  commitStrategy: CommitBoxStrategy;
  allowRotate: boolean;
}) {
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
          <RoiList allowRotate={props.allowRotate} />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton showImage={false} />
    </RoiProvider>
  );
}
