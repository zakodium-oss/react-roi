import { Meta } from '@storybook/react';
import { decode, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useCommittedRois,
} from '../../../src';
import { Image } from '../../utils/Image';
import { Layout } from '../../utils/Layout';
import { initialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useCommittedRois',
  decorators: [
    (Story) => (
      <RoiProvider initialConfig={{ rois: initialRois }}>
        <Layout>
          <RoiContainer target={<Image src="/barbara.jpg" />}>
            <RoiList />
          </RoiContainer>
          <Story />
        </Layout>
      </RoiProvider>
    ),
  ],
} as Meta;

export function DisplayCommitedRois() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rois = useCommittedRois();

  useEffect(() => {
    void fetch('/barbara.jpg')
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
