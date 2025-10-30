import { Meta } from '@storybook/react';
import { useState } from 'react';

import {
  CommittedRoiProperties,
  OnChangeCallback,
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
} from '../../src';
import { assert } from '../../src/utilities/assert';
import { CommittedRoisButton } from '../utils/CommittedRoisButton';
import { Layout } from '../utils/Layout';

export default {
  title: 'Lifecycle callbacks',
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
      onAfterDraw={() => {
        setCount(count + 1);
      }}
      onAfterMove={(roi, { updateRoi }) => {
        assert(roi.data);
        updateRoi(roi.id, {
          data: {
            ...roi.data,
            moveCount: roi.data.moveCount + 1,
          },
        });
      }}
      onAfterRotate={(roi, { updateRoi }) => {
        assert(roi.data);
        updateRoi(roi.id, {
          data: {
            ...roi.data,
            rotateCount: roi.data.rotateCount + 1,
          },
        });
      }}
      onAfterResize={(roi, { updateRoi }) => {
        assert(roi.data);
        updateRoi(roi.id, {
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
            rotateCount: 0,
            count: count + 1,
            resizeCount: 0,
          })}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<CountData>
            getStyle={() => ({
              rectAttributes: {
                fill: 'rgba(0, 0, 0, 0.7)',
              },
            })}
            allowRotate
            renderLabel={(roi) => {
              if (roi.action.type === 'drawing') return null;
              if (!roi.data) return null;
              return (
                <div
                  style={{
                    fontSize: 12,
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {`ROI ${roi.data.count}\nMoved: ${roi.data.moveCount}\nResized: ${roi.data.resizeCount}\nRotated: ${roi.data.rotateCount}`}
                </div>
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
    },
  },
];

export function SyncRoisAfterUpdate() {
  const updateRois: OnChangeCallback<SideData> = (
    roi,
    actions,
    roisBeforeUpdate,
  ) => {
    if (roi.data?.side === 'LEFT') {
      const rightRoi = roisBeforeUpdate.find((r) => r.data?.side === 'RIGHT');
      assert(rightRoi);
      actions.updateRoi(rightRoi.id, {
        x: roi.x + roi.width,
        y: roi.y,
        width: roi.width,
        height: roi.height,
        angle: roi.angle,
      });
    } else {
      const leftRoi = roisBeforeUpdate.find((r) => r.data?.side === 'LEFT');
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
      initialConfig={{ mode: 'select', rois: syncInitialRois }}
      onAfterMove={updateRois}
      onAfterResize={updateRois}
    >
      <Layout>
        <RoiContainer<SideData>
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<SideData>
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
    </RoiProvider>
  );
}

export function SyncRoisDuringUpdate() {
  const updateRois: OnChangeCallback<SideData> = (
    roi,
    actions,
    roisBeforeUpdate,
  ) => {
    if (roi.data?.side === 'LEFT') {
      const rightRoi = roisBeforeUpdate.find((r) => r.data?.side === 'RIGHT');
      assert(rightRoi);
      actions.updateRoi(rightRoi.id, {
        x: roi.x + roi.width,
        y: roi.y,
        width: roi.width,
        height: roi.height,
        angle: roi.angle,
      });
    } else {
      const leftRoi = roisBeforeUpdate.find((r) => r.data?.side === 'LEFT');
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
      initialConfig={{ mode: 'select', rois: syncInitialRois }}
      onAfterMove={updateRois}
      onAfterResize={updateRois}
      onChangeResize={updateRois}
      onChangeRotate={updateRois}
      onChangeMove={updateRois}
    >
      <Layout>
        <RoiContainer<SideData>
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<SideData>
            allowRotate
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
    </RoiProvider>
  );
}
