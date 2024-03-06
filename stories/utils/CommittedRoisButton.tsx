import { decode, writeCanvas } from 'image-js';
import { useEffect, useReducer, useRef } from 'react';

import { useCommittedRois } from '../../src';

export function CommittedRoisButton(props: {
  showImage?: boolean;
  isDefaultShown?: boolean;
}) {
  const { showImage = true } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  const rois = useCommittedRois();
  const [isShown, show] = useReducer((s) => !s, props.isDefaultShown || false);

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
              column: Math.round(roi.x),
              row: Math.round(roi.y),
            },
            width: Math.round(roi.width),
            height: Math.round(roi.height),
            out: image,
          });
        }

        if (ref.current) {
          writeCanvas(image, ref.current);
        }
      });
  }, [rois, isShown]);

  return (
    <>
      <button type="button" onClick={show}>
        {isShown ? 'Hide committed ROIs' : 'Show committed ROIs'}
      </button>
      {isShown && (
        <>
          {showImage && (
            <canvas
              ref={ref}
              id="transformed-image"
              style={{ maxWidth: 400 }}
            />
          )}
          <pre>{JSON.stringify(rois, null, 2)}</pre>
        </>
      )}
    </>
  );
}
