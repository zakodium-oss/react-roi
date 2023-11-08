import { Meta } from '@storybook/react';
import { Layout } from '../utils/Layout';
import { RoiContainer, RoiList, RoiProvider, useRoiActions } from '../../src';
import { Image } from '../utils/Image';

export default {
  title: 'Bugs',
} as Meta;

export function SameId() {
  return (
    <Layout>
      <RoiProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Internal />

          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}

function Internal() {
  const { createRoi } = useRoiActions();

  function onClick() {
    createRoi({
      id: '0000-0000-0000-0000',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
      label: 'toto',
    });
  }

  return (
    <button onClick={onClick}>
      Add a new ROI with id: 0000-0000-0000-0000
    </button>
  );
}
