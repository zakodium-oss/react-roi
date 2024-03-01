import { Meta } from '@storybook/react';
import { CSSProperties, ReactElement, SVGAttributes } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
  useRoiState,
} from '../../src';
import { assert } from '../../src/utilities/assert';
import { Layout } from '../utils/Layout';
import { getInitialRois } from '../utils/initialRois';

export default {
  title: 'Misc/Style customization',
} as Meta;

interface CustomColorData {
  backgroundColor: CSSProperties['backgroundColor'];
  selectedBackgroundColor: CSSProperties['backgroundColor'];
  textColor: CSSProperties['color'];
}

const initialRois = getInitialRois<CustomColorData>(320, 320, {
  textColor: 'white',
  selectedBackgroundColor: 'darkgreen',
  backgroundColor: 'green',
});

export function WithShadowAroundSelectedRoi() {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois, zoom: { min: 0.1 } }}>
        <RoiContainer
          style={{ backgroundColor: 'black' }}
          target={<TargetImage src="/barbara.jpg" />}
        >
          <RoiList<CustomColorData>
            allowRotate
            getOverlayOpacity={(roi, { isSelected }) =>
              isSelected && (roi.width > 0 || roi.height > 0) ? 0.6 : 0
            }
            getStyle={(_, { isSelected }) => ({
              resizeHandlerColor: isSelected ? 'white' : 'black',
              rectAttributes: {
                fill: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)',
              },
            })}
          />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

export function OverrideDefaultStyle() {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
            <RoiList<CustomColorData>
              getStyle={(roi, { isSelected }) => {
                const patternId = `stripe-pattern-${roi.id}`;
                return {
                  renderCustomPattern: () => (
                    <StripePattern
                      id={patternId}
                      pattern={{
                        space: 8,
                        strokeWidth: 1,
                        pathAttributes: {
                          stroke: isSelected ? 'white' : 'black',
                        },
                      }}
                      backgroundRectAttributes={{
                        fill: 'yellow',
                        fillOpacity: 0.2,
                      }}
                    />
                  ),
                  rectAttributes: {
                    fill: `url(#${patternId})`,
                    stroke: isSelected ? 'transparent' : 'black',
                    strokeWidth: 6,
                  },
                  resizeHandlerColor: 'white',
                };
              }}
            />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}

export function WithIndividualStyles() {
  function UpdateStyleButton() {
    const { selectedRoi } = useRoiState();
    const { updateRoi } = useActions<CustomColorData>();

    function onClick() {
      if (selectedRoi) {
        updateRoi(selectedRoi, {
          data: {
            textColor: 'white',
            selectedBackgroundColor: 'yellowgreen',
            backgroundColor: 'yellow',
          },
        });
      }
    }

    return (
      <button type="button" onClick={onClick}>
        Change color to yellow
      </button>
    );
  }
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <UpdateStyleButton />

        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList<CustomColorData>
            getStyle={(roi, { isSelected }) => {
              const { data } = roi;
              assert(data);
              const { backgroundColor, selectedBackgroundColor } = data;
              return {
                rectAttributes: {
                  fill: isSelected ? selectedBackgroundColor : backgroundColor,
                  opacity: isSelected ? 0.4 : 0.6,
                },
              };
            }}
          />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

export function CustomLabelRender() {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList<CustomColorData>
            renderLabel={(roi, { isSelected }) => {
              if (isSelected) {
                return null;
              }
              return (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    placeContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: 28,
                  }}
                >
                  {roi.label}
                </div>
              );
            }}
          />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

function StripePattern(props: {
  id: string;
  pattern: {
    space: number;
    strokeWidth: number;
    pathAttributes?: Omit<SVGAttributes<SVGPathElement>, 'strokeWidth'>;
  };
  backgroundRectAttributes?: SVGAttributes<SVGRectElement>;
}): ReactElement<{ id: string }, 'pattern'> | null {
  if (!props.pattern) {
    return null;
  }
  const {
    space,
    strokeWidth,
    pathAttributes = {
      stroke: 'black',
    },
  } = props.pattern;
  const patternSize = space * 2;
  const mainLine = `M0,${patternSize} l${patternSize},-${patternSize}`;
  const cornerLine1 = `M-${strokeWidth},${strokeWidth} l${strokeWidth * 2},-${strokeWidth * 2}`;
  const cornerLine2 = `M${patternSize - strokeWidth},${patternSize + strokeWidth} l${strokeWidth * 2},-${strokeWidth * 2}`;

  return (
    <pattern
      id={props.id}
      patternUnits="userSpaceOnUse"
      width={patternSize}
      height={patternSize}
    >
      <rect
        x={0}
        y={0}
        width={patternSize}
        height={patternSize}
        {...props.backgroundRectAttributes}
      />
      <path
        d={`${cornerLine1} ${mainLine} ${cornerLine2}`}
        strokeWidth={strokeWidth}
        {...pathAttributes}
      />
    </pattern>
  );
}
