import { decode, Image } from 'image-js';
import { useContext, useEffect, useState } from 'react';
import { ObjectInspector } from 'react-inspector';

import { RoiComponent } from '../components/RoiComponent';
import { RoiContext, RoiDispatchContext } from '../context/RoiContext';
import './css/HomePage.css';

const rois = [
  {
    rectangle: { origin: { row: 152, column: 369 }, width: 83, height: 15 },
    meta: { label: 'roi-1', rgba: [0, 0, 255, 1] },
  },
  {
    rectangle: { origin: { row: 193, column: 343 }, width: 34, height: 15 },
    meta: { label: 'roi-2', rgba: [0, 255, 0, 1] },
  },
  {
    rectangle: { origin: { row: 295, column: 346 }, width: 115, height: 32 },
    meta: { label: 'roi-3', rgba: [255, 0, 0, 1] },
  },
  {
    rectangle: { origin: { row: 83, column: 685 }, width: 72, height: 33 },
    meta: { label: 'roi-4', rgba: [0, 0, 0, 0.5] },
  },
];

const fetchImage = async (url: URL) => {
  const response = await fetch(url.pathname);
  const buffer = await response.arrayBuffer();
  return decode(new Uint8Array(buffer));
};

export function HomePage() {
  const { roiState } = useContext(RoiContext);
  const { roiDispatch } = useContext(RoiDispatchContext);
  const [image, setImage] = useState<Image | null>(null);

  useEffect(() => {
    fetchImage(new URL(`../../data/test.png`, import.meta.url))
      .then((image) => setImage(image))
      // eslint-disable-next-line no-console
      .catch((error) => console.warn(error));
    roiDispatch({ type: 'addRois', payload: rois });
  }, [roiDispatch]);
  return (
    <div className="page">
      {image ? (
        <RoiComponent image={image} options={{ width: 700, height: 500 }} />
      ) : null}
      <ObjectInspector expandLevel={2} data={{ roiState }} />
    </div>
  );
}
