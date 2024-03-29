import { Meta } from '@storybook/react';
import { KbsProvider, useKbsGlobal } from 'react-kbs';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
  decorators: [
    (Story) => (
      <KbsProvider>
        <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
          <Story />
        </RoiProvider>
      </KbsProvider>
    ),
  ],
} as Meta;

export function CancelActionWithShortcut() {
  const { cancelAction } = useActions();

  useKbsGlobal([
    {
      shortcut: ['Escape'],
      handler: (event) => cancelAction(event, { noUnselection: false }),
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
