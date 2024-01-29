import { Meta } from '@storybook/react';
import { useState } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src';
import { assert } from '../../../src/utilities/assert';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useActions',
} as Meta;

export function AddROI() {
  function CreateButton() {
    const { createRoi } = useActions();

    function onClick() {
      const newRoi = getInitialRois(320, 320)[0];
      newRoi.id = Math.random().toString(36);
      newRoi.label = 'Hello World!';
      createRoi(newRoi);
    }

    return (
      <button type="button" onClick={onClick}>
        Add a new ROI
      </button>
    );
  }

  return (
    <RoiProvider>
      <Layout>
        <CreateButton />
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

interface CountData {
  moveCount: number;
  resizeCount: number;
  count: number;
}

function OnLifecycleHooksInternal() {
  const { createRoi, updateRoi } = useActions<CountData>();
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <RoiContainer<CountData>
        target={<TargetImage id="story-image" src="/barbara.jpg" />}
        onDrawFinish={(roi) => {
          createRoi({
            ...roi,
            data: { moveCount: 0, count: count + 1, resizeCount: 0 },
          });
          setCount(count + 1);
        }}
        onMoveFinish={(selectedRoi, roi) => {
          assert(roi.data);
          updateRoi(selectedRoi, {
            ...roi,
            data: {
              ...roi.data,
              moveCount: roi.data.moveCount + 1,
            },
          });
        }}
        onResizeFinish={(selectedRoi, roi) => {
          assert(roi.data);
          updateRoi(selectedRoi, {
            ...roi,
            data: {
              ...roi.data,
              resizeCount: roi.data.resizeCount + 1,
            },
          });
        }}
      >
        <RoiList<CountData>
          renderLabel={(roi) => {
            if (!roi.data) return null;
            return `ROI ${roi.data?.count || 0}\nMoved: ${roi.data?.moveCount || 0}\nResized: ${roi.data?.resizeCount || 0}`;
          }}
        />
      </RoiContainer>
      <CommittedRoisButton />
    </Layout>
  );
}

export function LifecycleHooks() {
  return (
    <RoiProvider>
      <OnLifecycleHooksInternal />
    </RoiProvider>
  );
}
