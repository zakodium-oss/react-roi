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

export default {
  title: 'hooks/useActions',
} as Meta;

export function AddROI() {
  function CreateButton() {
    const { createRoi } = useActions();

    function onClick() {
      createRoi({
        id: Math.random().toString(36),
        x: 0,
        y: 0,
        width: 0.2,
        height: 0.2,
        label: 'Hello, World!',
      });
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
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
