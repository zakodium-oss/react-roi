import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function AddROI() {
  function CreateButton() {
    const { createRoi } = useActions();

    function onClick() {
      const newRoi = getInitialRois(320, 320)[0];
      newRoi.id = Math.random().toString(36);
      newRoi.label = 'Hello World!';
      createRoi(newRoi);
    }

    return (
      <button type="button" onClick={onClick}>
        Add a new ROI
      </button>
    );
  }

  return (
    <RoiProvider>
      <Layout>
        <CreateButton />
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
