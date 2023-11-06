import { Meta } from '@storybook/react';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useRoiActions,
  useRoiState,
} from '../../src';
import { CommittedRoi } from '../../src/types/Roi';
import { useEffect } from 'react';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

const initialRois: Array<CommittedRoi> = [
  {
    id: '0000-1111-2222-3333',
    x: 0,
    y: 0,
    width: 0.2,
    height: 0.2,
  },
];

export default {
  title: 'Actions',
  decorators: [
    (Story) => (
      <Layout>
        <RoiProvider initialRois={initialRois}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Story />

            <RoiContainer target={<Image />}>
              <RoiList
                getStyle={(roi, selected) => ({
                  style: {
                    backgroundColor: selected ? 'green' : 'darkgreen',
                    opacity: selected ? 0.4 : 0.6,
                  },
                })}
              />
            </RoiContainer>
          </div>
        </RoiProvider>
      </Layout>
    ),
  ],
} as Meta;

export function Add() {
  const { createRoi } = useRoiActions();

  function onClick() {
    createRoi({
      id: 'abcd-efgh-ijkl-mnop',
      x: 0,
      y: 0,
      width: 0.2,
      height: 0.2,
      label: 'My new roi',
    });
  }

  return <button onClick={onClick}>Add a new ROI</button>;
}

export function Remove() {
  const { selectedRoi } = useRoiState();
  const { removeRoi } = useRoiActions();

  return <button onClick={() => removeRoi(selectedRoi)}>Remove ROI</button>;
}

export function Update() {
  const { selectedRoi } = useRoiState();
  const { updateRoi } = useRoiActions();

  return (
    <button onClick={() => updateRoi(selectedRoi, { y: 0.1 })}>
      Update ROI
    </button>
  );
}

export function Mode(props: { type: 'draw' | 'select' }) {
  const { type } = props;
  const { setMode } = useRoiActions();

  useEffect(() => {
    setMode(type);
  }, [type]);

  return <></>;
}

Mode.argTypes = {
  type: {
    control: 'select',
    options: ['draw', 'select'],
  },
};

Mode.args = {
  type: 'draw',
};
