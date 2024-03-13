import { Meta } from '@storybook/react';
import { useState } from 'react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Edge cases',
} as Meta;

export function MultipleProvider() {
  const [displaySecondProvider, setDisplaySecondProvider] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <button
        type="button"
        onClick={() => setDisplaySecondProvider((old) => !old)}
      >
        {displaySecondProvider ? 'Remove' : 'Display'} second element
      </button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 5,
        }}
      >
        <div
          style={{
            backgroundColor: 'red',
            display: 'flex',
            flex: '1 1 0%',
            justifyContent: 'center',
          }}
        >
          <RoiProvider
            initialConfig={{
              rois: getInitialRois(320, 320),
              mode: 'select',
              zoom: { spaceAroundTarget: 0 },
              commitRoiBoxStrategy: 'round',
            }}
          >
            <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
              <RoiList />
            </RoiContainer>
          </RoiProvider>
        </div>
        {displaySecondProvider && (
          <div
            style={{
              backgroundColor: 'blue',
              display: 'flex',
              flex: '1 1 0%',
              justifyContent: 'center',
            }}
          >
            <RoiProvider
              initialConfig={{
                rois: getInitialRois(320, 320),
                mode: 'select',
                zoom: { spaceAroundTarget: 0 },
                commitRoiBoxStrategy: 'round',
              }}
            >
              <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
                <RoiList />
              </RoiContainer>
            </RoiProvider>
          </div>
        )}
      </div>
    </div>
  );
}
