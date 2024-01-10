import { Meta } from '@storybook/react';
import { useEffect } from 'react';

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
} as Meta;

export function DrawReadOnlyAndEditable() {
  function ChangeModePlugin() {
    const { setMode } = useActions();

    useEffect(() => {
      setMode('draw');
    }, [setMode]);

    return null;
  }

  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <ChangeModePlugin />
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList
            getReadOnly={(roi) => roi.id === initialRois[2].id}
            getStyle={(roi) => ({
              rectAttributes: {
                fill: roi.id === initialRois[2].id ? 'red' : 'gray',
              },
            })}
          />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
