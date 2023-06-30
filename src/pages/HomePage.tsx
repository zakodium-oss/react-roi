import { Image, decode } from 'image-js';
import { useContext, useEffect, useState } from 'react';
import { ObjectInspector } from 'react-inspector';

import { RoiComponent } from '../components/RoiComponent';
import { RoiContext } from '../context/RoiContext';
import './css/Pages.css';

export function HomePage() {
  const { roiState } = useContext(RoiContext);
  const imageURL = new URL(`../../data/test.png`, import.meta.url);
  const [image, setImage] = useState<Image>(new Image(1, 1));

  useEffect(() => {
    fetchImage(imageURL)
      .then((image) => setImage(image))
      // eslint-disable-next-line no-console
      .catch((error) => console.warn(error));
  });
  return (
    <div
      className="page"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <RoiComponent
        image={image}
        options={{
          width: image.width,
          height: image.height,
        }}
      />
      <ObjectInspector expandLevel={2} data={{ roiState }} />
    </div>
  );
}

async function fetchImage(url: URL) {
  const response = await fetch(url.pathname);
  const buffer = await response.arrayBuffer();
  const image = decode(new Uint8Array(buffer));
  return image;
}
