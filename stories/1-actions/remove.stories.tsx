import type { Meta } from '@storybook/react-vite';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
  useRoiState,
} from '../../src/index.ts';
import { CommittedRoisButton } from '../utils/CommittedRoisButton.tsx';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Actions',
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
