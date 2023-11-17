import { decode, writeCanvas } from 'image-js';
import { useEffect, useReducer, useRef } from 'react';

import { useCommittedRois } from '../../src';

export function CommittedRoisButton() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rois = useCommittedRois();
  const [isShown, show] = useReducer((s) => !s, false);

  useEffect(() => {
    const img = document.getElementById('story-image') as HTMLImageElement;
    if (!isShown || !ref.current || !img) {
      return;
    }

    void fetch(img.src)
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
  }, [rois, isShown]);

  return (
    <>
      <button type="button" onClick={show}>
        Show committed ROIs
      </button>
      {isShown && (
        <canvas ref={ref} id="transformed-image" style={{ maxWidth: 400 }} />
      )}
    </>
  );
}
