import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  UpdateData,
  useActions,
  useRoiState,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function UpdatePosition() {
  function UpdateXYPositionButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useActions();

    function onClick(type: 'start' | 'top') {
      const updated: UpdateData = {};
      if (type === 'start') {
        updated.x = 0;
      } else {
        updated.y = 0;
      }

      if (selectedRoi) {
        updateRoi(selectedRoi, updated);
      }
    }

    return (
      <div style={{ display: 'flex', gap: 5 }}>
        <button type="button" onClick={() => onClick('start')}>
          Move ROI to start
        </button>
        <button type="button" onClick={() => onClick('top')}>
          Move ROI to the top
        </button>
      </div>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <Layout>
        <UpdateXYPositionButton />
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

export function UpdateLabel() {
  function UpdateLabelButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useActions();

    function onClick() {
      if (selectedRoi) {
        updateRoi(selectedRoi, { label: 'Hello, World!' });
      }
    }

    return (
      <button type="button" onClick={onClick}>
        Update label
      </button>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <Layout>
        <UpdateLabelButton />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
