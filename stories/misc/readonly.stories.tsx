import { Meta } from '@storybook/react';
import { useState } from 'react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { CommittedRoi } from '../../src/types/Roi';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function ReadOnly() {
  const [state, setState] = useState<string | null>(null);

  function getReadOnly(roi: CommittedRoi) {
    return roi.id === state;
  }

  function ReadOnlyButton(props: { onClick: () => void }) {
    return (
      <button type="button" onClick={props.onClick}>
        Make first readonly
      </button>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <ReadOnlyButton onClick={() => setState(initialRois[0].id)} />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getReadOnly={getReadOnly} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}

export function canPanThroughReadOnly() {
  function getReadOnly(roi: CommittedRoi) {
    return roi.id === initialRois[0].id;
  }

  function getStyle(roi: CommittedRoi) {
    return {
      rectAttributes: {
        fill: roi.id === initialRois[0].id ? 'darkgreen' : 'red',
        opacity: roi.id === initialRois[0].id ? 0.4 : 0.6,
      },
    };
  }

  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getReadOnly={getReadOnly} getStyle={getStyle} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
