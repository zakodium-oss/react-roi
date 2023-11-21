import { RoiContainer, RoiList, RoiProvider } from '../src';

export function TestComponent() {
  return (
    <RoiProvider initialRois={initialRois()}>
      <div
        style={{
          width: '500px',
          height: '500px',
          backgroundColor: 'lightgreen',
        }}
      >
        <RoiContainer
          target={
            <div
              style={{
                width: '500px',
                height: '500px',
                backgroundColor: 'lightblue',
              }}
            />
          }
        >
          <RoiList
            renderLabel={(roi) => {
              return (
                <div
                  style={{
                    color: 'white',
                    backgroundColor: 'transparent',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    justifyItems: 'center',
                    fontSize: 12,
                  }}
                >
                  {roi.label}
                </div>
              );
            }}
            getStyle={(roi, { isSelected }) => {
              if (roi.id === 'box-1') {
                return {
                  rectAttributes: {
                    fill: isSelected ? 'blue' : 'black',
                    opacity: 0.5,
                  },
                };
              }

              return {
                rectAttributes: {
                  fill: isSelected ? 'green' : 'black',
                  opacity: 0.5,
                },
              };
            }}
          />
        </RoiContainer>
      </div>
    </RoiProvider>
  );
}

function initialRois() {
  return [
    {
      id: 'box-1',
      label: 'box1',
      x: 0,
      y: 0,
      width: 0.5,
      height: 0.5,
      data: { blurMethod: 'fill' },
    },
    {
      id: 'box-2',
      x: 0.7,
      width: 0.3,
      y: 0.7,
      height: 0.3,
      data: { blurMethod: 'fill' },
      label: 'box2',
    },
  ];
}
