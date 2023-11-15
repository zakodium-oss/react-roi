import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useActions,
  useRoiState,
} from '../../src';
import { initialRois } from '../actions/utils';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

export default {
  title: 'Example',
} as Meta;

export function UpdateLabel() {
  function UpdateLabelButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useActions();

    function onClick() {
      updateRoi(selectedRoi, { label: 'Hello, World!' });
    }

    return (
      <button type="button" onClick={onClick}>
        Update label
      </button>
    );
  }

  return (
    <RoiProvider initialRois={initialRois}>
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <UpdateLabelButton />
          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </Layout>
    </RoiProvider>
  );
}
