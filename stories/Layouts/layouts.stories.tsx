import { Meta } from '@storybook/react';

import { ResizeStrategy, RoiContainer, RoiList, RoiProvider } from '../../src';
import { CommittedRoisButton } from '../utils/CommittedRoisButton';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';
import { useResetOnChange } from '../utils/useResetOnChange';

export default {
  title: 'Layouts',
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

export function TallContainer(props: { resizeStrategy: ResizeStrategy }) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: initialRois,
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout fit>
        <div style={{ width: 300, height: 500 }}>
          <RoiContainer
            target={<Image src="/cats-640x640.jpg" />}
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

export function WideContainer(props: { resizeStrategy: ResizeStrategy }) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: initialRois,
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout>
        <div style={{ width: 500, height: 300 }}>
          <RoiContainer
            target={<Image src="/cats-640x640.jpg" />}
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

export function SmallImage(props: { resizeStrategy: ResizeStrategy }) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: initialRois,
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout>
        <RoiContainer
          target={<Image src="/cat-200x300.jpg" />}
          style={{ width: 300, height: 400, border: '1px solid red' }}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function DynamicContainer(props: { resizeStrategy: ResizeStrategy }) {
  const keyId = useResetOnChange([props.resizeStrategy]);
  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: initialRois,
        resizeStrategy: props.resizeStrategy,
      }}
    >
      <Layout>
        <RoiContainer
          style={{ maxWidth: '100%', height: 500, border: '1px solid red' }}
          target={<Image src="/cats-640x640.jpg" />}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
