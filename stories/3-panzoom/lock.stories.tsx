import type { Meta } from '@storybook/react-vite';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Pan and zoom',
} as Meta;

export function Zoom() {
  return (
    <Layout>
      <div>
        You can pan / zoom by holding the altkey and using your mouse /
        mousewheel
      </div>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
          <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}

export function LockZoom() {
  return (
    <Layout>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
          <RoiContainer lockZoom target={<TargetImage src="/barbara.jpg" />}>
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}

export function LockPan() {
  const initialRois = getInitialRois(320, 320);
  return (
    <Layout>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: initialRois }}>
          <RoiContainer lockPan target={<TargetImage src="/barbara.jpg" />}>
            <RoiList getReadOnly={(roi) => roi.id === initialRois[2].id} />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}
