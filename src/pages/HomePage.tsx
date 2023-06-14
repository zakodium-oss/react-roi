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
  const [size, setSize] = useState({ width: 0.7, height: 0.7 });

  useEffect(() => {
    fetchImage(imageURL, setImage);
  }, [size]);
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
          <DrawableComponent image={image} size={size} setSize={setSize} />
        ) : (
          <ResultComponent image={image} />
        )}
      </div>
    </div>
  );
}

function DrawableComponent({
  image,
  size,
  setSize,
}: {
  image: Image;
  size: { width: number; height: number };
  setSize: React.Dispatch<{ width: number; height: number }>;
}) {
  const { dynamicState } = useContext(DynamicContext);
  const wRef = useRef<HTMLInputElement>(null);
  const hRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <ImageComponent
            image={image}
            options={{
              width: image.width * size.width,
              height: image.height * size.height,
            }}
          />
          <ObjectInspector expandLevel={2} data={{ dynamicState }} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '10px',
          }}
        >
          width:
          <input
            ref={wRef}
            style={{ margin: '10px', width: '60px', height: '20px' }}
            name="width"
            type="number"
            defaultValue={0.7}
          />
          height:
          <input
            ref={hRef}
            style={{ margin: '10px', width: '60px', height: '20px' }}
            name="height"
            type="number"
            defaultValue={0.7}
          />
          <button
            style={{ marginLeft: '10px' }}
            onClick={() => {
              setSize({
                width: +(wRef.current?.value as string) || 0.7,
                height: +(hRef.current?.value as string) || 0.7,
              });
            }}
          >
            Set size
          </button>
        </div>
      </div>
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
      fillColor: [0, 0, 0, 255],
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
