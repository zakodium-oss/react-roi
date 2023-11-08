import { Meta } from '@storybook/react';
import { RoiContainer, RoiList, RoiProvider, useCommitedRois } from '../../src';
import { Image } from '../utils/Image';
import { useEffect, useRef } from 'react';
import { decode, writeCanvas } from 'image-js';
import { initialRois } from '../actions/utils';
import { Layout } from '../utils/Layout';

export default {
  title: 'Example/CommittedRoi',
  decorators: [
    (Story) => (
      <RoiProvider initialRois={initialRois}>
        <div
          style={{
            display: 'flex',
            gap: 5,
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Layout>
            <RoiContainer target={<Image />}>
              <RoiList />
            </RoiContainer>
          </Layout>
          <Story />
        </div>
      </RoiProvider>
    ),
  ],
} as Meta;

export function WithCommittedRoi() {
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

  return <canvas ref={ref} id="transformed-image" style={{ maxWidth: 300 }} />;
}
