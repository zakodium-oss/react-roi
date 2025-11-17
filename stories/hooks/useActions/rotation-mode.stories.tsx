import type { Meta } from '@storybook/react-vite';
import { useEffect } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src/index.ts';
import { Layout } from '../../utils/Layout.tsx';
import { getInitialRois } from '../../utils/initialRois.ts';

export default {
  title: 'hooks/useActions',
  decorators: [
    (Story) => (
      <RoiProvider
        initialConfig={{
          rois: getInitialRois(320, 320),
          rotationResolution: 2500,
        }}
      >
        <Story />
      </RoiProvider>
    ),
  ],
} as Meta;

export function RotationMode() {
  const actions = useActions();
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Shift') {
        actions.setMode('rotate_selected');
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === 'Shift') {
        actions.setMode('hybrid');
      }
    }
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [actions]);
  return (
    <Layout>
      <p>
        {
          "Use shift to switch between select_rotation and hybrid modes. This allows to rotate an ROI without enabling the ROI's rotation handle."
        }
      </p>
      <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
        <RoiList
          getStyle={(roi, roiAdditionalState) => {
            if (
              roi.action.type === 'rotating_free' &&
              roiAdditionalState.isSelected
            ) {
              return {
                rectAttributes: {
                  stroke: 'red',
                  fill: 'rgba(255,0,0,0.3)',
                },
              };
            }
            return {
              rectAttributes: {
                fill: 'rgba(0,0,0,0.3)',
              },
            };
          }}
        />
      </RoiContainer>
    </Layout>
  );
}
