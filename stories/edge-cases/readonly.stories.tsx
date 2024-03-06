import { Meta } from '@storybook/react';
import { useState } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useRoiState,
} from '../../src';
import { Roi } from '../../src/types/Roi';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Edge cases',
} as Meta;

export function ReadOnly() {
  const initialRois = getInitialRois(320, 320);
  const [state, setState] = useState<string | null>(null);

  function getReadOnly(roi: Roi) {
    return roi.id === state;
  }

  function ReadOnlyButton() {
    const { selectedRoi } = useRoiState();
    return (
      <button
        type="button"
        onClick={() => selectedRoi && setState(selectedRoi)}
      >
        Make selected read only
      </button>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <div>Making the selected ROI read-only should unselect it</div>
        <ReadOnlyButton />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getReadOnly={getReadOnly} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
