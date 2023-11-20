import { Meta } from '@storybook/react';

import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { CommittedRoisButton } from '../utils/CommittedRoisButton';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';
import { initialRois } from '../utils/initialRois';

export default {
  title: 'Layouts',
} as Meta;

export function FitWidthWhenTallImage() {
  return (
    <RoiProvider initialRois={initialRois}>
      <Layout>
        <div style={{ width: 500, height: 300 }}>
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

export function FitHeightWhenWideImage() {
  return (
    <RoiProvider initialRois={initialRois}>
      <Layout>
        <div style={{ width: 300, height: 400 }}>
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

export function CenterWhenSmallImage() {
  return (
    <RoiProvider initialRois={initialRois}>
      <Layout>
        <RoiContainer
          target={<Image src="/cat-200x300.jpg" />}
          style={{ width: 400, height: 400, border: '1px solid red' }}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function DynamicContainer() {
  return (
    <RoiProvider initialRois={initialRois}>
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
