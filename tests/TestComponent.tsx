import { RoiContainer, RoiProvider, RoiList } from '../src/index';

export function TestComponent() {
  return (
    <RoiProvider initialRois={initialRois()}>
      <RoiContainer
        target={
          <div style={{ width: '500px', height: '500px' }}>
            <div id="label">Label</div>
          </div>
        }
      >
        <RoiList />
      </RoiContainer>
    </RoiProvider>
  );
}

function initialRois() {
  return [
    {
      id: 'box-1',
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
          box1
        </div>
      ),
      x: 0,
      y: 0,
      width: 0.5,
      height: 0.5,
      style: {
        backgroundColor: 'black',
        opacity: 0.5,
      },
      selectedStyle: {
        backgroundColor: 'blue',
        opacity: 0.5,
      },
      data: { blurMethod: 'fill' },
    },
    {
      id: 'box-2',
      x: 0.7,
      width: 0.3,
      y: 0.7,
      height: 0.3,
      style: {
        backgroundColor: 'black',
        opacity: 0.5,
      },
      selectedStyle: {
        backgroundColor: 'green',
        opacity: 0.5,
      },
      data: { blurMethod: 'fill' },
      label: 'box2',
    },
  ];
}
