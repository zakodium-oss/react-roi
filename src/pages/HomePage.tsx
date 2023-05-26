import * as Image from 'image-js';

import './css/Pages.css';

import { ImageComponent } from '../components/ImageComponent';
import { useEffect, useState } from 'react';
import { StateObject } from '../components/StateObject';
import { Link } from 'react-router-dom';

export function HomePage() {
  const imageURL = new URL(`../../data/test.png`, import.meta.url);
  const [image, setImage] = useState<Image.Image>(new Image.Image(1, 1));
  useEffect(() => {
    fetchImage(imageURL, setImage);
  }, []);
  return (
    <div className="page">
      <div className="bar-button">
        <button className="button" style={{ marginLeft: '20px' }}>
          <Link to="/moveable">Moveable</Link>
        </button>
      </div>
      <div style={{ height: '100%' }}>
        <DraggableComponent image={image} />
      </div>
    </div>
  );
}

function DraggableComponent({ image }: { image: Image.Image }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1200px',
      }}
    >
      <ImageComponent
        image={image}
        options={{ width: image.width, height: image.height }}
      />
      <StateObject />
    </div>
  );
}

async function fetchImage(url: URL, setImage: React.Dispatch<Image.Image>) {
  const response = await fetch(url.pathname);
  const buffer = await response.arrayBuffer();
  const image = Image.decode(new Uint8Array(buffer));
  setImage(image);
}
