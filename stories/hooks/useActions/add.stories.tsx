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

export function ActionHooks() {
  const [count, setCount] = useState(0);
  return (
    <RoiProvider<CountData>
      onAfterDraw={() => {
        setCount(count + 1);
      }}
      onAfterMove={(selectedRoi, roi, { updateRoi }) => {
        assert(roi.data);
        updateRoi(selectedRoi, {
          ...roi,
          data: {
            ...roi.data,
            moveCount: roi.data.moveCount + 1,
          },
        });
      }}
      onAfterResize={(selectedRoi, roi, { updateRoi }) => {
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
      <Layout>
        <RoiContainer<CountData>
          getNewRoiData={() => ({
            moveCount: 0,
            count: count + 1,
            resizeCount: 0,
          })}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<CountData>
            renderLabel={(roi) => {
              if (roi.action.type === 'drawing') return null;
              if (!roi.data) return null;
              return `ROI ${roi.data?.count || 0}\nMoved: ${roi.data?.moveCount || 0}\nResized: ${roi.data?.resizeCount || 0}`;
            }}
          />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
