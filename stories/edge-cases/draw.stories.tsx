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
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Edge cases',
} as Meta;

export function DrawReadOnlyAndEditable() {
  function ChangeModePlugin() {
    const { setMode } = useActions();

    useEffect(() => {
      setMode('draw');
    }, [setMode]);

    return null;
  }

  const initialRois = getInitialRois(320, 320);
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
