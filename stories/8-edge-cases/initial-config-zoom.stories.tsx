import type { Meta } from '@storybook/react-vite';
import type { PropsWithChildren } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  getTargetImageStyle,
  useTargetRef,
} from '../../src/index.ts';

export default {
  title: 'Edge cases > zoom',
  decorators: (Story) => {
    return (
      <AppLayout>
        <Story />
      </AppLayout>
    );
  },
} as Meta;

function AppLayout(props: PropsWithChildren) {
  return (
    <div
      style={{
        height: '75vh',
        // background: '#f5f5f5',
        border: 'solid 1px black',
      }}
    >
      {props.children}
    </div>
  );
}

export function NoConfigWithTargetImage() {
  return (
    <RoiProvider>
      <RoiContainer
        target={<TargetImage src="/barbara.jpg" />}
        style={{ height: '100%' }}
      >
        <RoiList />
      </RoiContainer>
    </RoiProvider>
  );
}

export function InitialConfigZoomWithTargetImage() {
  return (
    <RoiProvider
      initialConfig={{ zoom: { initial: { origin: 'center', scale: 0.8 } } }}
    >
      <RoiContainer
        target={<TargetImage src="/barbara.jpg" />}
        style={{ height: '100%' }}
      >
        <RoiList />
      </RoiContainer>
    </RoiProvider>
  );
}

// when we use image with ref from useTargetRef it's broken
export function NoConfigWithoutTargetImage() {
  return (
    <RoiProvider>
      <Container />
    </RoiProvider>
  );
}

// when we use image with ref from useTargetRef it's broken
export function InitialConfigZoomWithoutTargetImage() {
  return (
    <RoiProvider
      initialConfig={{ zoom: { initial: { origin: 'center', scale: 0.8 } } }}
    >
      <Container />
    </RoiProvider>
  );
}

function Container() {
  const ref = useTargetRef<HTMLImageElement>();

  return (
    <RoiContainer
      target={
        <img
          ref={ref}
          src="/barbara.jpg"
          alt=""
          style={getTargetImageStyle()}
        />
      }
      style={{ height: '100%' }}
    >
      <RoiList />
    </RoiContainer>
  );
}
