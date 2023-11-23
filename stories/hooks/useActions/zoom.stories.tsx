import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, useActions } from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Image } from '../../utils/Image';
import { Layout } from '../../utils/Layout';
import { initialRois } from '../../utils/initialRois';
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
  },
  args: {
    minZoom: 0.1,
    maxZoom: 20,
  },
} as Meta;

interface ZoomStoryProps {
  minZoom: number;
  maxZoom: number;
}

export function Zoom({ minZoom, maxZoom }: ZoomStoryProps) {
  const keyId = useResetOnChange([minZoom, maxZoom]);
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
        rois: initialRois,
        zoom: {
          min: minZoom,
          max: maxZoom,
        },
      }}
    >
      <Layout fit>
        <ZoomButton />
        <RoiContainer target={<Image src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton />
    </RoiProvider>
  );
}
