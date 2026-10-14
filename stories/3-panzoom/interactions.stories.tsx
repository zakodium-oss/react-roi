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

export function NoZoomInteraction() {
  return (
    <Layout>
      <div>Zooming with the mouse wheel is not allowed, panning still is</div>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
          <RoiContainer
            interactions={{ zoom: false }}
            target={<TargetImage src="/barbara.jpg" />}
          >
            <RoiList />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}

export function NoPanInteraction() {
  const initialRois = getInitialRois(320, 320);
  return (
    <Layout>
      <div>Panning is not allowed, zooming with the mouse wheel still is</div>
      <div style={{ width: 300, height: 500 }}>
        <RoiProvider initialConfig={{ rois: initialRois }}>
          <RoiContainer
            interactions={{ pan: false }}
            target={<TargetImage src="/barbara.jpg" />}
          >
            <RoiList
              getInteractions={(roi) =>
                roi.id === initialRois[2].id ? { select: false } : undefined
              }
            />
          </RoiContainer>
        </RoiProvider>
      </div>
    </Layout>
  );
}
