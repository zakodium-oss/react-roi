import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../src';
import { Layout } from '../utils/Layout';

export default {
  title: 'Misc',
} as Meta;

export function CrashWithSameId() {
  function CreateButton() {
    const { createRoi } = useActions();

    function onClick() {
      createRoi({
        id: '0000-0000-0000-0000',
        x: 0,
        y: 0,
        width: 0.2,
        height: 0.2,
        label: 'A',
      });
    }

    return (
      <>
        <p>
          warning: this stories should throw an error if you add two time a ROI
          with the button.
        </p>
        <button type="button" onClick={onClick}>
          Add a new ROI with id: 0000-0000-0000-0000
        </button>
      </>
    );
  }

  return (
    <Layout>
      <RoiProvider>
        <CreateButton />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}
