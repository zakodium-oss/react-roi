import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useActions,
  useRoiState,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Image } from '../../utils/Image';
import { Layout } from '../../utils/Layout';
import { initialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function RemoveROI() {
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
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <RemoveButton />

        <RoiContainer target={<Image src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
