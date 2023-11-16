import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  UpdateData,
  useActions,
  useRoiState,
} from '../../../src';
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
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <UpdateXYPositionButton />

          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
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
