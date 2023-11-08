import { Meta } from '@storybook/react';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useRoiActions,
  useRoiState,
} from '../../src';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';
import { CSSProperties } from 'react';
import { CommittedRoi } from '../../src/types/Roi';

export default {
  title: 'Example/Override',
} as Meta;

interface CustomColorData {
  backgroundColor: CSSProperties['backgroundColor'];
  selectedBackgroundColor: CSSProperties['backgroundColor'];
  textColor: CSSProperties['color'];
}

const initialRois: Array<CommittedRoi<CustomColorData>> = [
  {
    id: '0000-1111-2222-3333',
    x: 0,
    y: 0,
    width: 0.2,
    height: 0.2,
    label: 'A',
    data: {
      textColor: 'white',
      selectedBackgroundColor: 'darkgreen',
      backgroundColor: 'green',
    },
  },
  {
    id: '1111-2222-3333-4444',
    x: 0.3,
    y: 0,
    width: 0.2,
    height: 0.2,
    label: 'B',
    data: {
      textColor: 'white',
      selectedBackgroundColor: 'darkgreen',
      backgroundColor: 'green',
    },
  },
  {
    id: '2222-3333-4444-5555',
    x: 0,
    y: 0.3,
    width: 0.3,
    height: 0.3,
    label: 'C',
    data: {
      textColor: 'white',
      selectedBackgroundColor: 'darkgreen',
      backgroundColor: 'green',
    },
  },
];

export function OverrideDefaultStyleWithClassname() {
  return (
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <RoiContainer target={<Image />}>
            <RoiList<CustomColorData>
              getStyle={(roi, selected) => ({
                style: {
                  opacity: selected ? 0.4 : 0.6,
                },
                className: selected ? 'selected' : 'not-selected',
              })}
            />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}

export function OverrideDefaultStyle() {
  return (
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <UpdateStyleButton />

          <RoiContainer target={<Image />}>
            <RoiList<CustomColorData>
              getStyle={(roi, selected) => {
                const {
                  data: { textColor, backgroundColor, selectedBackgroundColor },
                } = roi;

                return {
                  style: {
                    color: textColor,
                    backgroundColor: selected
                      ? backgroundColor
                      : selectedBackgroundColor,
                    opacity: selected ? 0.4 : 0.6,
                  },
                };
              }}
            />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}

function UpdateStyleButton() {
  const { selectedRoi } = useRoiState();
  const { updateRoi } = useRoiActions<CustomColorData>();

  function onClick() {
    updateRoi(selectedRoi, {
      data: {
        textColor: 'white',
        selectedBackgroundColor: 'yellowgreen',
        backgroundColor: 'yellow',
      },
    });
  }

  return <button onClick={onClick}>Change color to yellow</button>;
}
