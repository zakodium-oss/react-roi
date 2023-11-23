import { Meta } from '@storybook/react';
import { useState } from 'react';

import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { CommittedRoi } from '../../src/types/Roi';
import { Image } from '../utils/Image';
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
        <RoiContainer target={<Image src="/barbara.jpg" />}>
          <RoiList getReadOnly={getReadOnly} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
