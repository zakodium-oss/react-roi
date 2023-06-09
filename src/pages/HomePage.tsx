import { Image, decode, writeCanvas } from 'image-js';

import './css/Pages.css';

import { ImageComponent } from '../components/ImageComponent';
import { useContext, useEffect, useRef, useState } from 'react';
import { DynamicContext } from '../context/DynamicContext';
import { ObjectInspector } from 'react-inspector';

export function HomePage() {
  const imageURL = new URL(`../../data/test.png`, import.meta.url);
  const [image, setImage] = useState<Image>(new Image(1, 1));
  const [isDrawing, setIsDrawing] = useState(true);

  useEffect(() => {
    fetchImage(imageURL, setImage);
  }, []);
  return (
    <div className="page">
      <div className="bar-button">
        <button
          className="button"
          style={{ marginLeft: '20px' }}
          onClick={() => setIsDrawing(!isDrawing)}
        >
          {isDrawing ? 'Show result' : 'Draw'}
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        {isDrawing ? (
          <DrawableComponent image={image} />
        ) : (
          <ResultComponent image={image} />
        )}
      </div>
    </div>
  );
}

function DrawableComponent({ image }: { image: Image }) {
  const { dynamicState } = useContext(DynamicContext);
  return (
    <>
      <ImageComponent
        image={image}
        options={{ width: image.width, height: image.height }}
      />
      <ObjectInspector expandLevel={2} data={{ dynamicState }} />
    </>
  );
}

function ResultComponent({ image }: { image: Image }) {
  const imageRef = useRef<HTMLCanvasElement>(null);
  const { dynamicState } = useContext(DynamicContext);
  const result = image.clone();
  const objects = dynamicState.objects || [];
  for (const object of objects) {
    result.drawRectangle({
      ...object.rectangle,
      fillColor: [0, 255, 0, 255],
      out: result,
    });
  }

  useEffect(() => {
    if (!result) return;
    writeCanvas(result, imageRef.current as HTMLCanvasElement);
    return;
  }, [result]);
  return <canvas ref={imageRef} />;
}

async function fetchImage(url: URL, setImage: React.Dispatch<Image>) {
  const response = await fetch(url.pathname);
  const buffer = await response.arrayBuffer();
  const image = decode(new Uint8Array(buffer));
  setImage(image);
}
