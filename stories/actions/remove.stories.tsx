import { Meta } from '@storybook/react';
import { Layout } from '../utils/Layout';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useRoiActions,
  useRoiState,
} from '../../src';
import { Image } from '../utils/Image';
import { initialRois } from './utils';

export default {
  title: 'Actions',
} as Meta;

export function Remove() {
  function RemoveButton() {
    const { selectedRoi } = useRoiState();
    const { removeRoi } = useRoiActions();

    return <button onClick={() => removeRoi(selectedRoi)}>Remove ROI</button>;
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
