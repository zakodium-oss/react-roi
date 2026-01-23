import type { Meta } from '@storybook/react-vite';
import type { PropsWithChildren } from 'react';

import type { ResizeStrategy } from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  getTargetImageStyle,
  useTargetRef,
} from '../../src/index.ts';
import { useResetOnChange } from '../utils/useResetOnChange.ts';

export default {
  title: 'Edge cases > zoom',
  decorators: (Story) => {
    return (
      <AppLayout>
        <Story />
      </AppLayout>
    );
  },
  args: {
    resizeStrategy: 'contain',
  },
  argTypes: {
    resizeStrategy: {
      options: ['contain', 'cover', 'center', 'none'],
      control: {
        type: 'select',
      },
    },
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

export function NoConfigWithTargetImage(props: {
  resizeStrategy: ResizeStrategy;
}) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{ resizeStrategy: props.resizeStrategy }}
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

export function InitialConfigZoomWithTargetImage(props: {
  resizeStrategy: ResizeStrategy;
}) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        zoom: { initial: { origin: 'center', scale: 0.8 } },
        resizeStrategy: props.resizeStrategy,
      }}
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
export function NoConfigWithoutTargetImage(props: {
  resizeStrategy: ResizeStrategy;
}) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{ resizeStrategy: props.resizeStrategy }}
    >
      <Container />
    </RoiProvider>
  );
}

// when we use image with ref from useTargetRef it's broken
export function InitialConfigZoomWithoutTargetImage(props: {
  resizeStrategy: ResizeStrategy;
}) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        zoom: { initial: { origin: 'center', scale: 0.8 } },
        resizeStrategy: props.resizeStrategy,
      }}
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
