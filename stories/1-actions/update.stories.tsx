import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';

import type {
  BoundaryStrategy,
  CommittedRoiProperties,
  UpdateData,
  UpdateRoiOptionsBoundaryStrategy,
  XRotationCenter,
  YRotationCenter,
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

export function UpdateRoiPosition() {
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

export function UpdateRoiAngle() {
  function UpdateXYPositionButton() {
    const [angle, setAngle] = useState('15');
    const [xRotationCenter, setXRotationCenter] =
      useState<XRotationCenter>('center');
    const [yRotationCenter, setYRotationCenter] =
      useState<YRotationCenter>('center');
    const { selectedRoi } = useRoiState();
    const { updateRoiAngle } = useActions();

    function updateAngle(commit: boolean, angle: number) {
      if (selectedRoi) {
        updateRoiAngle(selectedRoi, (angle * Math.PI) / 180, {
          xRotationCenter,
          yRotationCenter,
          commit,
          boundaryStrategy: 'none',
        });
      }
    }

    return (
      <div
        style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 5 }}
      >
        <label htmlFor="angle">Angle (degrees)</label>
        <input
          id="angle"
          type="number"
          onChange={(event) => setAngle(event.target.value)}
          value={angle}
        />
        <label htmlFor="xRotationCenter">Center X</label>
        <select
          id="xRotationCenter"
          name="xRotationCenter"
          onChange={(event) =>
            setXRotationCenter(event.target.value as XRotationCenter)
          }
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
        <label htmlFor="yRotationCenter">Center Y</label>
        <select
          id="yRotationCenter"
          name="yRotationCenter"
          onChange={(event) =>
            setYRotationCenter(event.target.value as YRotationCenter)
          }
        >
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>

        <button type="button" onClick={() => updateAngle(true, Number(angle))}>
          Set angle and commit
        </button>
        <input
          type="range"
          min={-180}
          max={180}
          step={1}
          value={angle}
          onChange={(event) => {
            const angle = event.target.valueAsNumber;
            setAngle(angle.toString());
            updateAngle(false, angle);
          }}
          onPointerUp={() => {
            updateAngle(true, Number(angle));
          }}
        />
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

export function UpdatePositionWithCommitStrategyDebug() {
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
            origin: 'center',
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
        <p>
          Update the black / transparent ROI and see how it affects the orange
          ROI.
          <br />
          {
            "On commit, the black / transparent ROI's coordinate are passed to the orange ROI via the `updateRoi` action, with the boundary strategy selected below."
          }
        </p>

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
