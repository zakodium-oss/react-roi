import { Meta } from '@storybook/react';
import { decode, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useCommittedRois,
} from '../../../src';
import { Layout } from '../../utils/Layout';
import { getInitialRois } from '../../utils/initialRois';

export default {
  title: 'hooks/useCommittedRois',
  decorators: [
    (Story) => (
      <RoiProvider initialConfig={{ rois: getInitialRois(320, 320) }}>
        <Layout>
          <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
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
              column: roi.x,
              row: roi.y,
            },
            width: roi.width,
            height: roi.height,
            out: image,
          });
        }

        writeCanvas(image, ref.current);
      });
  }, [rois]);

  return <canvas ref={ref} id="transformed-image" style={{ maxWidth: 300 }} />;
}
