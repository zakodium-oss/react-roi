import { Meta } from '@storybook/react';
import { writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

import {
  Point,
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
            getStyle={() => ({
              resizeHandlerColor: 'white',
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

  // Transform image
  useEffect(() => {
    if (!image) {
      return;
    }
    const matrix = getRotationMatrix(roi.angle, roi);

    const croppedImage = image.transform(matrix, {
      width: roi.width,
      height: roi.height,
      inverse: true,
    });

    if (ref.current) {
      writeCanvas(croppedImage, ref.current);
    }
  }, [roi, image]);

  return <canvas ref={ref} id="transformed-image" />;
}

function getRotationMatrix(angle: number, point: Point) {
  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);

  return [
    [angleCos, -angleSin, point.x],
    [angleSin, angleCos, point.y],
  ];
}
