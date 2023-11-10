import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { initialRois } from '../actions/utils';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';
import { CommittedRoi } from '../../src/types/Roi';

export default {
  title: 'Example',
} as Meta;

export function ReadOnly() {
  function getReadOnly(roi: CommittedRoi) {
    // make the first roi readOnly
    return roi.id === initialRois[0].id;
  }

  return (
    <RoiProvider initialRois={initialRois}>
      <Layout>
        <RoiContainer target={<Image />}>
          <RoiList getReadOnly={getReadOnly} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
