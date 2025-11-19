import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';

import type {
  BoundaryStrategy,
  CommittedRoiProperties,
  UpdateData,
  UpdateRoiOptionsBoundaryStrategy,
} from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
  useRoiState,
} from '../../src/index.ts';
import { CommittedRoisButton } from '../utils/CommittedRoisButton.tsx';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Actions',
} as Meta;

export function UpdatePosition() {
  function UpdateXYPositionButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useActions();

    function onClick(type: 'start' | 'top') {
      const updated: UpdateData = {};
      if (type === 'start') {
        updated.x = 0;
      } else {
        updated.y = 0;
      }

      if (selectedRoi) {
        updateRoi(selectedRoi, updated);
      }
    }

    return (
      <div style={{ display: 'flex', gap: 5 }}>
        <button type="button" onClick={() => onClick('start')}>
          Move ROI to start
        </button>
        <button type="button" onClick={() => onClick('top')}>
          Move ROI to the top
        </button>
      </div>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <Layout>
        <UpdateXYPositionButton />
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

const baseRoi: CommittedRoiProperties<BoundaryStrategy> = {
  id: 'editable',
  x: 50,
  y: 50,
  width: 100,
  height: 100,
  angle: 0,
};
const initialRois: Array<CommittedRoiProperties<BoundaryStrategy>> = [
  {
    ...baseRoi,
    id: 'non-editable',
    data: 'partially_inside',
  },

  baseRoi,
];

export function UpdatePositionWithCommitStrategy() {
  const [strategy, setStrategy] =
    useState<UpdateRoiOptionsBoundaryStrategy>('partially_inside');
  function SelectStrategy() {
    const { updateRoi } = useActions<UpdateRoiOptionsBoundaryStrategy>();
    return (
      <select
        value={strategy}
        onChange={(event) => {
          setStrategy(event.target.value as UpdateRoiOptionsBoundaryStrategy);
          updateRoi('non-editable', {
            data: event.target.value as UpdateRoiOptionsBoundaryStrategy,
          });
        }}
      >
        <option value={'inside' satisfies UpdateRoiOptionsBoundaryStrategy}>
          Inside
        </option>
        <option
          value={'partially_inside' satisfies UpdateRoiOptionsBoundaryStrategy}
        >
          Partially inside
        </option>
        <option value={'none' satisfies UpdateRoiOptionsBoundaryStrategy}>
          None
        </option>
      </select>
    );
  }
  return (
    <RoiProvider
      initialConfig={{
        rois: initialRois,
        mode: 'select',
        commitRoiBoundaryStrategy: 'none',
        zoom: {
          min: 0.1,
          initial: {
            scale: 0.5,
            translation: [80, 80],
          },
        },
      }}
      onCommit={({ roi, actions }) => {
        actions.updateRoi(
          'non-editable',
          {
            width: roi.width,
            height: roi.height,
            x: roi.x,
            y: roi.y,
            angle: roi.angle,
          },
          {
            commit: true,
            boundaryStrategy: strategy,
          },
        );
      }}
    >
      <Layout>
        <SelectStrategy />
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
          style={{ border: '1px solid red' }}
        >
          <RoiList<BoundaryStrategy>
            displayRotationHandle
            getReadOnly={(roi) => roi.id !== 'editable'}
            renderLabel={({ data }) => data}
            getStyle={({ isReadOnly }) => {
              if (isReadOnly) {
                return {
                  rectAttributes: {
                    fill: 'orange',
                  },
                  resizeHandlerColor: 'rgba(0,0,0,0.1)',
                };
              }
              return {
                rectAttributes: {
                  fill: 'rgba(0,0,0,0.2)',
                },
              };
            }}
          />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

export function UpdateLabel() {
  function UpdateLabelButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useActions();

    function onClick() {
      if (selectedRoi) {
        updateRoi(selectedRoi, { label: 'Hello, World!' });
      }
    }

    return (
      <button type="button" onClick={onClick}>
        Update label
      </button>
    );
  }

  return (
    <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
      <Layout>
        <UpdateLabelButton />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
