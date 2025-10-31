import type { Meta } from '@storybook/react-vite';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../src/index.ts';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Edge cases',
} as Meta;

export function CrashWithSameId() {
  function CreateButton() {
    const { createRoi } = useActions();
    const newRoi = getInitialRois(320, 320)[0];
    newRoi.id = 'ROI 1';
    function onClick() {
      createRoi(newRoi);
    }

    return (
      <>
        <p>
          warning: this stories should throw an error if you add two time a ROI
          with the button.
        </p>
        <button type="button" onClick={onClick}>
          {'Add a new ROI with id "ROI 1"'}
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
