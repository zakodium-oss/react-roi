import { Image, encode } from 'image-js';
import { ObjectInspector } from 'react-inspector';

import './css/HomePage.css';

import {
  RoiProvider,
  useRoiState,
  useRoiActions,
  useRois,
  useCommitedRois,
  RoiContainer,
  RoiBox,
} from '../index';
import { CommittedRoi } from '../types/CommittedRoi';

interface RoiData {
  blurMethod: 'pixelate' | 'blur' | 'fill';
}

const initialRois: Array<CommittedRoi<RoiData>> = [
  {
    id: crypto.randomUUID(),
    x: 152,
    y: 269,
    width: 100,
    height: 50,
    style: {
      fill: 'black',
      opacity: 0.5,
    },
    editStyle: {
      fill: 'blue',
      opacity: 0.5,
    },
    data: { blurMethod: 'fill' },
  },
  {
    id: crypto.randomUUID(),
    x: 343,
    y: 193,
    width: 34,
    height: 15,
    style: {
      fill: 'black',
      opacity: 0.5,
    },
    editStyle: {
      fill: 'green',
      opacity: 0.5,
    },
    data: { blurMethod: 'fill' },
  },
];

export function HomePage() {
  return (
    <div className="page">
      <RoiProvider initialRois={initialRois}>
        <MyComponent />
      </RoiProvider>
    </div>
  );
}

function MyComponent() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Toolbar />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImageWithRois />
          <TransformedImage />
        </div>
      </div>
      <RoiStateObjectInspector />
    </>
  );
}

function RoiStateObjectInspector() {
  const state = useRoiState();
  return <ObjectInspector expandLevel={2} data={state} />;
}

function Toolbar() {
  const { mode, selectedRoi } = useRoiState();
  const { setMode, createRoi, updateRoi, removeRoi } = useRoiActions<RoiData>();
  return (
    <div
      style={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px',
      }}
    >
      <div>Mode: {mode}</div>
      <button type="button" onClick={() => setMode('select')}>
        Select
      </button>
      <button type="button" onClick={() => setMode('draw')}>
        Draw
      </button>
      <button
        type="button"
        onClick={() =>
          createRoi({
            id: crypto.randomUUID(),
            // All the following roi properties are optional
            // When creating a new ROI, the default position is the center, reasonably sized based on the size of the target
            x: 100,
            y: 50,
            width: 100,
            height: 100,
            label: 'My new roi',
            // All styles are optional and created randomly if not provided
            style: {
              fill: '#ff5500',
              opacity: 0.6,
            },
            editStyle: {
              fill: '#ffaa00',
              opacity: 0.4,
            },
            data: {
              blurMethod: 'pixelate',
            },
          })
        }
      >
        Create ROI
      </button>
      <button
        type="button"
        onClick={() => {
          updateRoi(selectedRoi, {
            y: 10,
            style: {
              fill: 'green',
              opacity: 0.6,
            },
            editStyle: {
              fill: 'lightgreen',
              opacity: 0.4,
            },
          });
        }}
      >
        Update
      </button>
      <button
        type="button"
        onClick={() => {
          removeRoi(selectedRoi);
        }}
      >
        Remove
      </button>
    </div>
  );
}

function ImageWithRois() {
  // The type of rois is Roi<RoiData>[]
  const image = new Image(500, 400).fill(255);
  image.drawRectangle({ out: image });
  image.drawCircle({ column: 250, row: 200 }, 200, { out: image });
  const buffer = encode(image);
  const blob = new Blob([buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return (
    <RoiContainer
      target={<img src={url} />}
      options={{ containerWidth: 800, containerHeight: 500 }}
    >
      <RoiList />
    </RoiContainer>
  );
}

function RoiList() {
  const rois = useRois<RoiData>();
  return (
    <>
      {rois.map((roi) => (
        <RoiBox key={roi.id} roi={roi} />
      ))}
    </>
  );
}

function TransformedImage() {
  const image = new Image(500, 400).fill(255);
  image.drawRectangle({ out: image });
  image.drawCircle({ column: 250, row: 200 }, 200, { out: image });
  const rois = useCommitedRois<RoiData>();
  for (const roi of rois) {
    const { x, y, width, height } = roi;
    image.drawRectangle({
      origin: { row: y, column: x },
      width,
      height,
      out: image,
    });
  }
  const buffer = encode(image);
  const blob = new Blob([buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return <img src={url} style={{ width: 500, height: 400, padding: '10px' }} />;
}
