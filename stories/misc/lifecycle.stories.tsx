import { Meta } from '@storybook/react';
import { useState } from 'react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
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
      onAfterRotate={(selectedRoi, roi, { updateRoi }) => {
        assert(roi.data);
        updateRoi(selectedRoi, {
          ...roi,
          data: {
            ...roi.data,
            rotateCount: roi.data.rotateCount + 1,
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
