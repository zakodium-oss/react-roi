import { Meta } from '@storybook/react';
import { Layout } from '../utils/Layout';
import { RoiContainer, RoiList, RoiProvider, useRoiActions } from '../../src';
import { Image } from '../utils/Image';

export default {
  title: 'Actions',
} as Meta;

export function Add() {
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
      id: Math.random().toString(36),
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
      label: 'toto',
    });
  }

  return <button onClick={onClick}>Add a new ROI</button>;
}
