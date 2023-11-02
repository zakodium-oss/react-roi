import { RoiContainer, RoiList, RoiProvider, useRoiActions } from '../src';
import { Meta } from '@storybook/react';

export default {
  title: 'Tests',
  decorators: [
    (Story) => (
      <RoiProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Story />

          <RoiContainer target={<Target />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    ),
  ],
} as Meta;

function Target() {
  return <img src="/barbara.jpg" style={{ display: 'block', width: '100%' }} />;
}

export function AddWithOnlySelectedCallName() {
  const { createRoi } = useRoiActions();

  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
      selectedClassName: 'darkorange',
    });
  }

  return <button onClick={onClick}>Add a new ROI</button>;
}

export function AddWithoutStyle() {
  const { createRoi } = useRoiActions();

  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
    });
  }

  return <button onClick={onClick}>Add a new ROI</button>;
}
