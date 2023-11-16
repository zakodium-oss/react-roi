import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, useActions } from '../../../src';
import { Image } from '../../utils/Image';
import { Layout } from '../../utils/Layout';
import { initialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function Zoom() {
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
    <RoiProvider minZoom={1} maxZoom={20} initialRois={initialRois}>
      <Layout>
        <ZoomButton />
        <RoiContainer target={<Image />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
