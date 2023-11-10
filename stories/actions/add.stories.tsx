import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider, useRoiActions } from '../../src';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

export default {
  title: 'Actions',
} as Meta;

export function Add() {
  // eslint-disable-next-line react/no-unstable-nested-components
  function CreateButton() {
    const { createRoi } = useRoiActions();

    function onClick() {
      createRoi({
        id: Math.random().toString(36),
        x: 0,
        y: 0,
        width: 0.2,
        height: 0.2,
        label: 'Hello, World!',
      });
    }

    return (
      <button type="button" onClick={onClick}>
        Add a new ROI
      </button>
    );
  }

  return (
    <Layout>
      <RoiProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <CreateButton />

          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}