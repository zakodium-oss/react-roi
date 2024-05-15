import { Meta } from '@storybook/react';

import {
  PanZoom,
  ResizeStrategy,
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
  useCommittedRois,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';
import { useResetOnChange } from '../../utils/useResetOnChange';

export default {
  title: 'hooks/useActions',
  argTypes: {
    onZoomChange: { action: 'zoom' },
    minZoom: {
      control: {
        type: 'number',
        min: 0.0001,
        max: 1000,
        step: 0.1,
      },
    },
    maxZoom: {
      control: {
        type: 'number',
        min: 0.0001,
        max: 1000,
        step: 0.1,
      },
    },
    spaceAroundTarget: {
      control: {
        type: 'number',
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
    containerWidth: {
      control: 'number',
    },
    containerHeight: {
      control: 'number',
    },
    resizeStrategy: {
      control: 'select',
      options: ['contain', 'cover', 'center', 'none'],
    },
  },
  args: {
    minZoom: 0.1,
    maxZoom: 20,
    spaceAroundTarget: 0.5,
    containerWidth: 500,
    containerHeight: 500,
    resizeStrategy: 'cover',
  },
} as Meta;

interface ZoomStoryProps {
  minZoom: number;
  maxZoom: number;
  spaceAroundTarget: number;
  containerWidth: number;
  containerHeight: number;
  resizeStrategy: ResizeStrategy;
  onZoomChange: (zoom: PanZoom) => void;
}

export function UpdateZoom({
  minZoom,
  maxZoom,
  spaceAroundTarget,
  containerWidth,
  containerHeight,
  onZoomChange,
  resizeStrategy,
}: ZoomStoryProps) {
  const keyId = useResetOnChange([
    minZoom,
    maxZoom,
    resizeStrategy,
    spaceAroundTarget,
    containerWidth,
    containerHeight,
  ]);

  function ZoomButton() {
    const { zoom } = useActions();

    function onClick(factor: number) {
      zoom(factor);
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          alignItems: 'flex-end',
          position: 'absolute',
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <button
          style={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          type="button"
          onClick={() => onClick(1.2)}
        >
          +
        </button>

        <button
          style={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          type="button"
          onClick={() => onClick(0.8)}
        >
          -
        </button>
      </div>
    );
  }

  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(320, 320),
        zoom: {
          min: minZoom,
          max: maxZoom,
          spaceAroundTarget,
        },
        resizeStrategy,
      }}
      onAfterZoomChange={onZoomChange}
    >
      <Layout fit>
        <div>You can create custom UI to control the zoom</div>
        <ZoomButton />
        <RoiContainer
          style={{
            width: containerWidth,
            height: containerHeight,
            border: '2px red solid',
          }}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList />
        </RoiContainer>
      </Layout>
      <CommittedRoisButton />
    </RoiProvider>
  );
}

export function ZoomIntoROI({
  minZoom,
  maxZoom,
  resizeStrategy,
  spaceAroundTarget,
  containerWidth,
  containerHeight,
  onZoomChange,
}: ZoomStoryProps) {
  const keyId = useResetOnChange([
    minZoom,
    maxZoom,
    resizeStrategy,
    spaceAroundTarget,
    containerWidth,
    containerHeight,
  ]);

  return (
    <RoiProvider
      key={keyId}
      initialConfig={{
        rois: getInitialRois(320, 320),
        zoom: {
          min: minZoom,
          max: maxZoom,
          spaceAroundTarget,
        },
        resizeStrategy,
      }}
      onAfterZoomChange={onZoomChange}
    >
      <Layout fit>
        <div style={{ display: 'flex', gap: '3px' }}>
          <RoiContainer
            style={{
              width: containerWidth,
              height: containerHeight,
              border: '2px red solid',
            }}
            target={<TargetImage id="story-image" src="/barbara.jpg" />}
          >
            <RoiList />
          </RoiContainer>

          <ZoomTargetButtons />
        </div>
      </Layout>
      <CommittedRoisButton />
    </RoiProvider>
  );
}

function ZoomTargetButtons() {
  const rois = useCommittedRois();
  const { zoomIntoROI } = useActions();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rois.map((roi, idx) => (
        <button
          type="button"
          key={roi.id}
          onClick={() => {
            zoomIntoROI(roi);
          }}
        >
          Zoom into ROI {idx}
        </button>
      ))}
    </div>
  );
}
