import type { Meta } from '@storybook/react-vite';

import type {
  GetInteractionsCallback,
  GetStyleCallback,
  RoiInteractions,
} from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src/index.ts';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'ROI interactions',
} as Meta;

const initialRois = getInitialRois(320, 320);
const [roiA, roiB, roiC] = initialRois;

export function NotSelectable() {
  const getInteractions: GetInteractionsCallback = ({ id }) => {
    return id === roiA.id ? { select: false } : undefined;
  };
  const getStyle: GetStyleCallback = ({ interactions }) => ({
    rectAttributes: {
      fill: interactions.select ? 'red' : 'darkgreen',
      opacity: interactions.select ? 0.6 : 0.4,
    },
  });
  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <div>The green ROI cannot be selected.</div>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getInteractions={getInteractions} getStyle={getStyle} />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}

export function SelectableButFrozen() {
  const getInteractions: GetInteractionsCallback = ({ id }) => {
    return id === roiA.id
      ? { move: false, resize: false, rotate: false }
      : undefined;
  };
  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <div>
          Roi A can be selected but not moved, resized or rotated. Dragging it
          does nothing.
        </div>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getInteractions={getInteractions} showRotationHandle />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}

export function PerRoiRestrictions() {
  const restrictions: Record<string, RoiInteractions> = {
    [roiA.id]: { move: false },
    [roiB.id]: { resize: false },
    [roiC.id]: { rotate: false },
  };
  const getInteractions: GetInteractionsCallback = ({ id }) => {
    return restrictions[id];
  };
  return (
    <RoiProvider initialConfig={{ rois: initialRois }}>
      <Layout>
        <div>
          Roi A cannot be moved, Roi B cannot be resized, Roi C cannot be
          rotated.
        </div>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList getInteractions={getInteractions} showRotationHandle />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
