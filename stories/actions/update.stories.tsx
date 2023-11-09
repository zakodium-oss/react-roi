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

export function Update() {
  function UpdateXYPositionButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useRoiActions();

    function onClick(type: 'start' | 'top') {
      let updated: any = {};
      if (type === 'start') {
        updated.x = 0;
      } else {
        updated.y = 0;
      }

      updateRoi(selectedRoi, updated);
    }

    return (
      <div style={{ display: 'flex', gap: 5 }}>
        <button onClick={() => onClick('start')}>Move ROI to start</button>
        <button onClick={() => onClick('top')}>Move ROI to the top</button>
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
