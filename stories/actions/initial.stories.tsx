import { Meta } from '@storybook/react';
import { RoiContainer, RoiList, RoiProvider } from '../../src';
import { CommittedRoi } from '../../src/types/Roi';

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

function Target() {
  return <img src="/barbara.jpg" style={{ display: 'block', width: '100%' }} />;
}

export function Initial() {
  return (
    <RoiProvider initialRois={initialRois}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <RoiContainer target={<Target />}>
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
  );
}
