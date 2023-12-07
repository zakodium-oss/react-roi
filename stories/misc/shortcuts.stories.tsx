import { Meta } from '@storybook/react';
import { KbsProvider, useKbsGlobal } from 'react-kbs';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../src';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';

export default {
  title: 'Misc',
  decorators: [
    (Story) => (
      <KbsProvider>
        <RoiProvider initialConfig={{ rois: initialRois }}>
          <Story />
        </RoiProvider>
      </KbsProvider>
    ),
  ],
} as Meta;

export function Shortcuts() {
  const { cancelAction } = useActions();

  useKbsGlobal([
    {
      shortcut: ['Escape'],
      handler: cancelAction,
    },
  ]);

  return (
    <Layout>
      <p>
        Try moving a ROI. And while still holding the ROI, press your Escape
        button. The ROI&apos;s position will be reset
      </p>
      <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
        <RoiList />
      </RoiContainer>
    </Layout>
  );
}
