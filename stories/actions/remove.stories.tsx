import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useActions,
  useRoiState,
} from '../../src';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

import { initialRois } from './utils';

export default {
  title: 'Actions',
} as Meta;

export function Remove() {
  function RemoveButton() {
    const { selectedRoi } = useRoiState();
    const { removeRoi } = useActions();

    return (
      <button type="button" onClick={() => removeRoi(selectedRoi)}>
        Remove ROI
      </button>
    );
  }

  return (
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <RemoveButton />

          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}
