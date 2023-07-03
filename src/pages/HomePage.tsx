import { decode, Image } from 'image-js';
import { useContext, useEffect, useState } from 'react';
import { ObjectInspector } from 'react-inspector';

import { RoiComponent } from '../components/RoiComponent';
import { RoiContext } from '../context/RoiContext';
import './css/Pages.css';

export function HomePage() {
  const { roiState } = useContext(RoiContext);
  const [image, setImage] = useState<Image | null>(null);
  useEffect(() => {
    const fetchImage = async (url: URL) => {
      const response = await fetch(url.pathname);
      const buffer = await response.arrayBuffer();
      return decode(new Uint8Array(buffer));
    };
    fetchImage(new URL(`../../data/test.png`, import.meta.url))
      .then((image) => setImage(image))
      // eslint-disable-next-line no-console
      .catch((error) => console.warn(error));
  }, []);
  return (
    <div
      className="page"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        margin: '10px',
      }}
    >
      {
        // demo with images
        image ? (
          <RoiComponent image={image} options={{ width: 700, height: 500 }} />
        ) : null
      }
      {/* {
        // demo with svg
        <RoiComponent>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="600"
            viewBox="0 0 800 600"
            style={{ border: '1px solid black' }}
          />
        </RoiComponent>
      } */}
      {/* {
        // demo with svg
        <RoiComponent>
          <div style={{ width: '800px', height: '600px' }} />
        </RoiComponent>
      } */}
      <ObjectInspector expandLevel={2} data={{ roiState }} />
    </div>
  );
}
