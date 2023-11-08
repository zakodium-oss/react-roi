import { Meta } from '@storybook/react';
import { Layout } from '../utils/Layout';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useCommittedRois,
  useRoiActions,
  useRoiState,
} from '../../src';
import { Image } from '../utils/Image';
import { initialRois } from './utils';

export default {
  title: 'Actions',
} as Meta;

export function Update() {
  return (
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Internal />

          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}

function Internal() {
  const { selectedRoi } = useRoiState();
  const committedRois = useCommittedRois();
  const { updateRoi } = useRoiActions();

  function onClick(type: 'start' | 'end') {
    const selected = committedRois.find((r) => r.id === selectedRoi);
    if (!selected) return;

    updateRoi(selectedRoi, { x: type === 'start' ? 0 : 1 - selected.width });
  }

  return (
    <div style={{ display: 'flex', gap: 5 }}>
      <button onClick={() => onClick('start')}>Move ROI to start</button>
      <button onClick={() => onClick('end')}>Move ROI to end</button>
    </div>
  );
}
