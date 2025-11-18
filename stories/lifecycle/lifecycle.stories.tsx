import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';
import { KbsProvider, useKbsGlobal } from 'react-kbs';
import { v4 } from 'uuid';

import type {
  CommittedRoiProperties,
  OnChangeCallback,
  OnCommitCallback,
} from '../../src/index.ts';
import {
  LabelContainer,
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../src/index.ts';
import { assert } from '../../src/utilities/assert.ts';
import { CommittedRoisButton } from '../utils/CommittedRoisButton.tsx';
import { Layout } from '../utils/Layout.tsx';

export default {
  title: 'Lifecycle callbacks',
  decorators: [
    (Story) => (
      <KbsProvider>
        <Story />
      </KbsProvider>
    ),
  ],
} as Meta;

interface CountData {
  moveCount: number;
  resizeCount: number;
  rotateCount: number;
  count: number;
}

export function ActionHooks() {
  const [count, setCount] = useState(0);
  return (
    <RoiProvider<CountData>
      onCommit={({ roi, actions, actionType }) => {
        assert(roi.data);
        switch (actionType) {
          case 'drawing': {
            setCount(count + 1);
            break;
          }
          case 'moving': {
            actions.updateRoi(roi.id, {
              data: {
                ...roi.data,
                moveCount: roi.data.moveCount + 1,
              },
            });
            break;
          }
          case 'resizing': {
            actions.updateRoi(roi.id, {
              data: {
                ...roi.data,
                resizeCount: roi.data.resizeCount + 1,
              },
            });
            break;
          }
          case 'rotating': {
            actions.updateRoi(roi.id, {
              data: {
                ...roi.data,
                rotateCount: roi.data.rotateCount + 1,
              },
            });
            break;
          }
          default:
            break;
        }
      }}
    >
      <Layout>
        <RoiContainer<CountData>
          getNewRoiData={() => ({
            count: count + 1,
            moveCount: 0,
            resizeCount: 0,
            rotateCount: 0,
          })}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<CountData>
            getStyle={() => ({
              rectAttributes: {
                fill: 'rgba(0, 0, 0, 0.7)',
              },
            })}
            displayRotationHandle
            renderLabel={({ action, data }) => {
              if (action === 'drawing') return null;
              if (!data) return null;
              return (
                <LabelContainer style={{ fontSize: 12 }}>
                  {`ROI ${data.count}\nMoved: ${data.moveCount}\nResized:${data.resizeCount}\nRotated: ${data.rotateCount}`}
                </LabelContainer>
              );
            }}
          />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}

interface SideData {
  side: 'LEFT' | 'RIGHT';
  pairId: string;
}

const syncInitialRois: Array<CommittedRoiProperties<SideData>> = [
  {
    id: 'roi-left',
    x: 50,
    y: 100,
    width: 100,
    height: 100,
    angle: 0,
    label: 'LEFT',
    data: {
      side: 'LEFT',
      pairId: 'pair-1',
    },
  },
  {
    id: 'roi-right',
    x: 150,
    y: 100,
    width: 100,
    height: 100,
    angle: 0,
    label: 'RIGHT',
    data: {
      side: 'RIGHT',
      pairId: 'pair-1',
    },
  },
];

export function SyncRoisAfterUpdate() {
  const updateRois: OnCommitCallback<SideData> = (param) => {
    const { roi, actions, actionType, roisBeforeCommit } = param;
    assert(roi.data);
    if (actionType === 'drawing') {
      actions.createRoi({
        id: v4(),
        x: roi.x + roi.width,
        y: roi.y,
        width: roi.width,
        height: roi.height,
        angle: roi.angle,
        data: {
          ...roi.data,
          side: 'RIGHT',
        },
      });
    } else if (roi.data.side === 'LEFT') {
      const rightRoi = roisBeforeCommit.find(
        (r) => r.data?.side === 'RIGHT' && r.data?.pairId === roi.data?.pairId,
      );
      assert(rightRoi);
      actions.updateRoi(rightRoi.id, {
        x: roi.x + roi.width,
        y: roi.y,
        width: roi.width,
        height: roi.height,
        angle: roi.angle,
      });
    } else {
      const leftRoi = roisBeforeCommit.find(
        (r) => r.data?.side === 'LEFT' && r.data?.pairId === roi.data?.pairId,
      );
      assert(leftRoi);
      actions.updateRoi(leftRoi.id, {
        x: roi.x - roi.width,
        y: roi.y,
        width: roi.width,
        height: roi.height,
        angle: roi.angle,
      });
    }
  };
  return (
    <RoiProvider<SideData>
      initialConfig={{ mode: 'hybrid', rois: syncInitialRois }}
      onCommit={updateRois}
    >
      <Layout>
        <RoiContainer<SideData>
          getNewRoiData={() => ({
            side: 'LEFT',
            pairId: v4(),
          })}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<SideData>
            renderLabel={(roi) => roi.data?.side}
            getStyle={(roi) => ({
              rectAttributes: {
                fill: roi.data?.side === 'LEFT' ? 'lightyellow' : 'blue',
                opacity: 0.5,
              },
            })}
          />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
      <CancelWithShortcut />
    </RoiProvider>
  );
}

export function SyncRoisDuringUpdate() {
  const updateRois: (commit: boolean) => OnChangeCallback<SideData> =
    (commit: boolean) => (param) => {
      const { roi, actions, actionType, roisBeforeCommit } = param;
      if (!roi || actionType === 'drawing') {
        return;
      }
      assert(roi.data);
      if (roi.data.side === 'LEFT') {
        const rightRoi = roisBeforeCommit.find(
          (r) =>
            r.data?.side === 'RIGHT' && r.data?.pairId === roi.data?.pairId,
        );
        assert(rightRoi);
        actions.updateRoi(
          rightRoi.id,
          {
            x: roi.x + roi.width,
            y: roi.y,
            width: roi.width,
            height: roi.height,
            angle: roi.angle,
          },
          { commit },
        );
      } else {
        const leftRoi = roisBeforeCommit.find(
          (r) => r.data?.side === 'LEFT' && r.data?.pairId === roi.data?.pairId,
        );
        assert(leftRoi);
        actions.updateRoi(
          leftRoi.id,
          {
            x: roi.x - roi.width,
            y: roi.y,
            width: roi.width,
            height: roi.height,
            angle: roi.angle,
          },
          { commit },
        );
      }
    };

  return (
    <RoiProvider<SideData>
      initialConfig={{ mode: 'hybrid', rois: syncInitialRois }}
      onCommit={(param) => {
        const { roi, actions, actionType } = param;
        assert(roi.data);
        if (actionType === 'drawing') {
          actions.createRoi({
            id: v4(),
            x: roi.x + roi.width,
            y: roi.y,
            width: roi.width,
            height: roi.height,
            angle: roi.angle,
            data: {
              ...roi.data,
              side: 'RIGHT',
            },
          });
        } else {
          updateRois(true)(param);
        }
      }}
      onChange={(param) => updateRois(false)(param)}
    >
      <Layout>
        <RoiContainer<SideData>
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
          getNewRoiData={() => ({
            side: 'LEFT',
            pairId: v4(),
          })}
        >
          <RoiList<SideData>
            renderLabel={(roi) => roi.data?.side}
            displayRotationHandle
            getStyle={(roi) => ({
              rectAttributes: {
                fill: roi.data?.side === 'LEFT' ? 'lightyellow' : 'blue',
                opacity: 0.5,
              },
            })}
          />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
      <CancelWithShortcut />
    </RoiProvider>
  );
}

function CancelWithShortcut() {
  const { cancelAction } = useActions();
  useKbsGlobal([
    {
      shortcut: ['Escape'],
      handler: (event) =>
        cancelAction(event, {
          noUnselection: false,
        }),
    },
  ]);
  return null;
}
