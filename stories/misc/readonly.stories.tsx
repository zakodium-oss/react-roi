import { Meta } from '@storybook/react';
import { useState } from 'react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Roi } from '../../src/types/Roi';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
} as Meta;

export function ReadOnly() {
  const initialRois = getInitialRois(320, 320);
  const [state, setState] = useState<string | null>(null);

  function getReadOnly(roi: Roi) {
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
  const initialRois = getInitialRois(320, 320);
  function getReadOnly(roi: Roi) {
    return roi.id === initialRois[0].id;
  }

  function getStyle(roi: Roi) {
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
