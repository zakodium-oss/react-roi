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
import { useResetOnChange } from '../../utils/useResetOnChange';

export default {
  title: 'hooks/useActions',
  argTypes: {
    minZoom: {
      control: {
        type: 'number',
        min: 0.0001,
        max: 1000,
        step: 0.1,
      },
    },
    maxZoom: {
      control: {
        type: 'number',
        min: 0.0001,
        max: 1000,
        step: 0.1,
      },
    },
    spaceAroundTarget: {
      control: {
        type: 'number',
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
    containerWidth: {
      control: 'number',
    },
    containerHeight: {
      control: 'number',
    },
  },
  args: {
    minZoom: 0.1,
    maxZoom: 20,
    spaceAroundTarget: 0.5,
    containerWidth: 500,
    containerHeight: 500,
  },
} as Meta;

interface ZoomStoryProps {
  minZoom: number;
  maxZoom: number;
  spaceAroundTarget: number;
  containerWidth: number;
  containerHeight: number;
}

export function Zoom({
  minZoom,
  maxZoom,
  spaceAroundTarget,
  containerWidth,
  containerHeight,
}: ZoomStoryProps) {
  const keyId = useResetOnChange([
    minZoom,
    maxZoom,
    spaceAroundTarget,
    containerWidth,
    containerHeight,
  ]);
  function ZoomButton() {
    const { zoom } = useActions();

    function onClick(factor: number) {
      zoom(factor);
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          alignItems: 'flex-end',
          position: 'absolute',
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <button
          style={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          type="button"
          onClick={() => onClick(1.2)}
        >
          +
        </button>

        <button
          style={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          type="button"
          onClick={() => onClick(0.8)}
        >
          -
        </button>
      </div>
    );
  }

  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(320, 320),
        zoom: {
          min: minZoom,
          max: maxZoom,
          spaceAroundTarget,
        },
      }}
    >
      <Layout fit>
        <ZoomButton />
        <RoiContainer
          style={{
            width: containerWidth,
            height: containerHeight,
            border: '2px red solid',
          }}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton />
    </RoiProvider>
  );
}
