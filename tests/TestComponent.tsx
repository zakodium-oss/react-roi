import { RoiContainer, RoiList, RoiProvider, useTargetRef } from '../src';

export function TestComponent() {
  return (
    <RoiProvider initialConfig={{ rois: initialRois() }}>
      <div
        style={{
          width: '500px',
          height: '500px',
          backgroundColor: 'lightgreen',
        }}
      >
        <RoiContainer target={<Target />}>
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

function Target() {
  const ref = useTargetRef();
  return (
    <div
      ref={ref}
      style={{
        width: '500px',
        height: '500px',
        backgroundColor: 'lightblue',
      }}
    />
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
