import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { initialRois } from '../actions/utils';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';
import { CommittedRoi } from '../../src/types/Roi';
import { useState } from 'react';

export default {
  title: 'Example',
} as Meta;

export function ReadOnly() {
  const [state, setState] = useState<string | null>(null);

  function getReadOnly(roi: CommittedRoi) {
    return roi.id === state;
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  function ReadOnlyButton(props: { onClick: () => void }) {
    return (
      <button type="button" onClick={props.onClick}>
        Make first readonly
      </button>
    );
  }

  return (
    <RoiProvider initialRois={initialRois}>
      <Layout>
        <ReadOnlyButton onClick={() => setState(initialRois[0].id)} />
        <RoiContainer target={<Image />}>
          <RoiList getReadOnly={getReadOnly} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
