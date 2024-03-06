import { Meta } from '@storybook/react';
import { useState } from 'react';

import { RoiContainer, RoiList, RoiProvider, TargetImage } from '../../src';
import { Layout } from '../utils/Layout';

export default {
  title: 'ROI custom styles',
  args: {
    allowRotate: false,
  },
} as Meta;

interface StoryProps {
  allowRotate: boolean;
}

export function NewRoiData({ allowRotate }: StoryProps) {
  const [selectedColor, setSelectedColor] = useState('blue');
  return (
    <RoiProvider>
      <Layout>
        <select
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
        >
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>
        <RoiContainer<string>
          getNewRoiData={() => {
            return selectedColor;
          }}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<string>
            allowRotate={allowRotate}
            getStyle={(roi) => {
              return {
                rectAttributes: {
                  fill: roi.data,
                },
              };
            }}
          />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
