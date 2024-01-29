import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
  useRoiState,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function RemoveROI() {
  function RemoveButton() {
    const { selectedRoi } = useRoiState();
    const { removeRoi } = useActions();

    return (
      <button
        type="button"
        onClick={() => {
          if (selectedRoi) {
            removeRoi(selectedRoi);
          }
        }}
      >
        Remove ROI
      </button>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <Layout>
        <RemoveButton />

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
