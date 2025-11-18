import type { Meta } from '@storybook/react-vite';
import type { CSSProperties, ReactElement, SVGAttributes } from 'react';
import { useState } from 'react';

import type { RoiListProps } from '../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
  useRoiState,
} from '../../src/index.ts';
import { assert } from '../../src/utilities/assert.ts';
import { Layout } from '../utils/Layout.tsx';
import { getInitialRois } from '../utils/initialRois.ts';

export default {
  title: 'Custom styles',
  args: {
    showGrid: false,
    displayRotationHandle: false,
    gridHorizontalLineCount: 2,
    gridVerticalLineCount: 2,
    gridSpacingX: 0,
    gridSpacingY: 0,
  },
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

type StoryProps = Pick<
  RoiListProps,
  | 'displayRotationHandle'
  | 'showGrid'
  | 'gridHorizontalLineCount'
  | 'gridVerticalLineCount'
  | 'gridSpacingX'
  | 'gridSpacingY'
>;

export function ControlGrid(props: StoryProps) {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList<CustomColorData> {...props} />
        </RoiContainer>
      </RoiProvider>
    </Layout>
  );
}

export function WithShadowAroundSelectedRoi(props: StoryProps) {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois, zoom: { min: 0.1 } }}>
        <RoiContainer
          style={{ backgroundColor: 'black' }}
          target={<TargetImage src="/barbara.jpg" />}
        >
          <RoiList<CustomColorData>
            {...props}
            getOverlayOpacity={({ isSelected, box }) =>
              isSelected && (box.width > 0 || box.height > 0) ? 0.6 : 0
            }
            getStyle={({ isSelected }) => ({
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

export function OverrideDefaultStyle(props: StoryProps) {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
            <RoiList<CustomColorData>
              {...props}
              getStyle={({ id, isSelected }) => {
                const patternId = `stripe-pattern-${id}`;
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

export function WithIndividualStyles(props: StoryProps) {
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
            {...props}
            getStyle={({ isSelected, data }) => {
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

export function CustomLabelRender(props: StoryProps) {
  return (
    <Layout>
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList<CustomColorData>
            {...props}
            renderLabel={({ isSelected, label }) => {
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
                  {label}
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

export function StyleNewRoi(props: StoryProps) {
  const [selectedColor, setSelectedColor] = useState('blue');
  return (
    <RoiProvider>
      <Layout>
        <select
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
        >
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>
        <RoiContainer<string>
          getNewRoiData={() => {
            return selectedColor;
          }}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList<string>
            {...props}
            getStyle={(roi) => {
              return {
                rectAttributes: {
                  fill: roi.data,
                },
              };
            }}
          />
        </RoiContainer>
      </Layout>
    </RoiProvider>
  );
}
