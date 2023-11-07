import { Meta } from '@storybook/react';
import { RoiContainer, RoiList, RoiProvider, useCommitedRois } from '../src';
import { CommittedRoi } from '../src/types/Roi';
import { Image } from './utils/Image';
import { Layout } from './utils/Layout';
import { useEffect, useRef } from 'react';
import { decode, writeCanvas } from 'image-js';

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
  title: 'Example/CommitedRoi',
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

export function WithCommitedRoi() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rois = useCommitedRois();

  useEffect(() => {
    fetch('/barbara.jpg')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const image = decode(new DataView(buffer));

        for (const roi of rois) {
          image.drawRectangle({
            strokeColor: [255, 255, 255],
            origin: {
              column: Math.round(roi.x * image.width),
              row: Math.round(roi.y * image.height),
            },
            width: Math.round(roi.width * image.width),
            height: Math.round(roi.height * image.height),
            out: image,
          });
        }

        writeCanvas(image, ref.current);
      });
  }, [rois]);

  return <canvas ref={ref} id="transformed-image" />;
}
