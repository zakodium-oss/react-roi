import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  UpdateData,
  useActions,
  useRoiState,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Image } from '../../utils/Image';
import { Layout } from '../../utils/Layout';
import { initialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions/Update ROI',
} as Meta;

export function Position() {
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

      updateRoi(selectedRoi, updated);
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
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <UpdateXYPositionButton />
        <RoiContainer target={<Image src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function Label() {
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
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <UpdateLabelButton />
        <RoiContainer target={<Image src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
