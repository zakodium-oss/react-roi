import type { Meta } from '@storybook/react-vite';

import type { ResizeStrategy } from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { CommittedRoisButton } from '../utils/CommittedRoisButton.tsx';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';
import { useResetOnChange } from '../utils/useResetOnChange.ts';

export default {
  title: 'Preferences',
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

export function ResizeStrategyTall(props: { resizeStrategy: ResizeStrategy }) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(640, 640),
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout fit>
        <div style={{ width: 300, height: 500 }}>
          <RoiContainer
            target={<TargetImage id="story-image" src="/cats-640x640.jpg" />}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid red',
            }}
          >
            <RoiList />
          </RoiContainer>
        </div>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function ResizeStrategyWide(props: { resizeStrategy: ResizeStrategy }) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(640, 640),
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout>
        <div style={{ width: 500, height: 300 }}>
          <RoiContainer
            target={<TargetImage id="story-image" src="/cats-640x640.jpg" />}
            style={{ width: '100%', height: '100%', border: '1px solid red' }}
          >
            <RoiList />
          </RoiContainer>
        </div>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function ResizeStrategySmallImage(props: {
  resizeStrategy: ResizeStrategy;
}) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(200, 300),
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout>
        <RoiContainer
          target={<TargetImage id="story-image" src="/cat-200x300.jpg" />}
          style={{ width: 300, height: 400, border: '1px solid red' }}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function ResizeStrategyDynamicContainer(props: {
  resizeStrategy: ResizeStrategy;
}) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(640, 640),
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout>
        <RoiContainer
          style={{ maxWidth: '100%', height: 500, border: '1px solid red' }}
          target={<TargetImage id="story-image" src="/cats-640x640.jpg" />}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
