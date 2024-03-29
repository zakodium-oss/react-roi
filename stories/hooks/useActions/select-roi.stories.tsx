import { Meta } from '@storybook/react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function SelectRoi() {
  function SelectButtons() {
    const initialRois = getInitialRois(320, 320);
    const { selectRoi } = useActions();
    const buttons = initialRois.map((roi) => {
      return (
        <button
          key={roi.id}
          type="button"
          onClick={() => selectRoi(roi.id)}
        >{`Select ROI ${roi.id}`}</button>
      );
    });

    buttons.push(
      <button type="button" onClick={() => selectRoi(null)}>
        Unselect ROI
      </button>,
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {buttons}
      </div>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <Layout>
        <div style={{ display: 'flex', gap: 8 }}>
          <RoiContainer
            target={<TargetImage id="story-image" src="/barbara.jpg" />}
          >
            <RoiList />
          </RoiContainer>
          <SelectButtons />
        </div>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
