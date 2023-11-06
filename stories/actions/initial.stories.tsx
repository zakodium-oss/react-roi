import { Meta } from '@storybook/react';
import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { CommittedRoi } from '../../src/types/Roi';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

export default {
  title: 'Actions',
} as Meta;

const initialRois: Array<CommittedRoi> = [
  {
    id: '0000-1111-2222-3333',
    label: (
      <div
        style={{
          color: 'white',
          backgroundColor: 'transparent',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          fontSize: '12px',
        }}
      >
        Styled label
      </div>
    ),
    x: 0,
    y: 0,
    width: 0.5,
    height: 0.5,
  },
];

export function Initial() {
  return (
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
  );
}

export function WithDefaultStyle() {
  return (
    <Layout>
      <RoiProvider initialRois={initialRois}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}
