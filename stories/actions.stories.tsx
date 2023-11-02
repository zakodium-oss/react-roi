import { Meta } from '@storybook/react';
import { RoiContainer, RoiList, RoiProvider, useRoiActions } from '../src';
import { CSSProperties } from 'react';

export default {
  title: 'Actions',
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
  return (
    <img
      src="./../public/barbara.jpg"
      style={{ display: 'block', width: '100%' }}
    />
  );
}

interface AddWithStyleProps {
  style: CSSProperties;
  selectedStyle: CSSProperties;
}

export function AddWithStyle(props: AddWithStyleProps) {
  const { createRoi } = useRoiActions();

  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
      ...props,
    });
  }

  return <button onClick={onClick}>Add a new ROI</button>;
}

AddWithStyle.args = {
  style: {
    backgroundColor: 'green',
  },
  selectedStyle: {
    backgroundColor: 'darkgreen',
  },
} as AddWithStyleProps;

interface AddWithClassNameProps {
  className: string;
  selectedClassName: string;
}

export function AddWithClassName(props: AddWithClassNameProps) {
  const { createRoi } = useRoiActions();

  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
      ...props,
    });
  }

  return <button onClick={onClick}>Add a new ROI</button>;
}

AddWithClassName.args = {
  className: 'orange',
  selectedClassName: 'darkorange',
} as AddWithClassNameProps;
