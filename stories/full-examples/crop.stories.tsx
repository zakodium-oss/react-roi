import { Meta } from '@storybook/react';
import { Point, writeCanvas } from 'image-js';
import { useEffect, useRef, useState } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useCommittedRois,
} from '../../src';
import { CommittedRoi } from '../../src/types/Roi';
import { Layout } from '../utils/Layout';
import { useLoadImage } from '../utils/useLoadImage';

export default {
  title: 'Full examples',
} as Meta;

const startRoi: CommittedRoi = {
  id: '0000-1111-2222-3333',
  x: 0.35 * 320,
  y: 0.35 * 320,
  width: Math.floor(0.3 * 320),
  height: Math.floor(0.3 * 320),
  label: 'Roi A',
  angle: 0,
};
export function CropImage() {
  return (
    <Layout>
      <RoiProvider
        initialConfig={{
          commitRoiBoxStrategy: 'round',
          selectedRoiId: startRoi.id,
          mode: 'select',
          rois: [startRoi],
        }}
      >
        <RoiContainer
          noUnselection
          style={{ backgroundColor: 'black', borderRadius: '4px' }}
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList
            allowRotate
            getOverlayOpacity={() => 0.6}
            getStyle={(roi) => ({
              resizeHandlerColor:
                roi.action.type !== 'idle' ? 'rgba(255,255,255,0.5)' : 'white',
              rectAttributes: {
                fill: 'rgba(0,0,0,0.2)',
              },
            })}
          />
        </RoiContainer>
        <CroppedImage />
      </RoiProvider>
    </Layout>
  );
}

function CroppedImage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const roi = useCommittedRois()[0];
  const image = useLoadImage('story-image', ref);
  const [scale, setScale] = useState(2);

  // Transform image
  useEffect(() => {
    if (!image) {
      return;
    }
    const matrix = getRotationMatrix(roi.angle, { column: roi.x, row: roi.y });

    const croppedImage = image.transform(matrix, {
      width: roi.width,
      height: roi.height,
      inverse: true,
      interpolationType: 'nearest',
    });

    if (ref.current) {
      writeCanvas(croppedImage, ref.current);
    }
  }, [roi, image]);

  return (
    <>
      <select
        style={{ display: 'block' }}
        defaultValue={2}
        onChange={(event) => setScale(+event.target.value)}
      >
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={4}>4x</option>
        <option value={8}>8x</option>
        <option value={16}>16x</option>
      </select>
      <canvas
        ref={ref}
        id="transformed-image"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          imageRendering: 'pixelated',
        }}
      />
    </>
  );
}

function getRotationMatrix(angle: number, point: Point) {
  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);

  return [
    [angleCos, -angleSin, point.column],
    [angleSin, angleCos, point.row],
  ];
}
