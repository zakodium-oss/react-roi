import { Image, encode } from 'image-js';

import { CommittedRoi } from './types/Roi';

import {
  RoiProvider,
  useRoiState,
  useRoiActions,
  useRois,
  useCommitedRois,
  RoiContainer,
  RoiBox,
} from './index';

interface RoiData {
  blurMethod: 'pixelate' | 'blur' | 'fill';
}

const imageWidth = 600;
const imageHeight = 400;

const initialRois: Array<CommittedRoi<RoiData>> = [
  {
    id: crypto.randomUUID(),
    x: 0,
    y: 0,
    width: 0.2,
    height: 0.2,
    style: {
      backgroundColor: 'black',
      opacity: 0.5,
    },
    selectedStyle: {
      backgroundColor: 'blue',
      opacity: 0.5,
    },
    data: { blurMethod: 'fill' },
  },
  {
    id: crypto.randomUUID(),
    x: 0.7,
    width: 0.3,
    y: 0.7,
    height: 0.3,
    style: {
      backgroundColor: 'black',
      opacity: 0.5,
    },
    selectedStyle: {
      backgroundColor: 'green',
      opacity: 0.5,
    },
    data: { blurMethod: 'fill' },
  },
];

export default function App() {
  return (
    <>
      <div style={{ height: 2000 }}>Hi!</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <RoiProvider initialRois={initialRois}>
          <MyComponent />
        </RoiProvider>
      </div>
    </>
  );
}

function MyComponent() {
  return (
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
  );
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
            x: 0.4,
            y: 0.4,
            width: 0.2,
            height: 0.2,
            label: 'My new roi',
            // All styles are optional and created randomly if not provided
            style: {
              backgroundColor: '#ff5500',
              opacity: 0.6,
            },
            selectedStyle: {
              backgroundColor: '#ffaa00',
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
            y: 0.1,
            style: {
              backgroundColor: 'green',
              opacity: 0.6,
            },
            selectedStyle: {
              backgroundColor: 'lightgreen',
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
  const image = new Image(imageWidth, imageHeight).fill(255);
  image.drawRectangle({ out: image });
  image.drawCircle({ column: 250, row: 200 }, 200, { out: image });
  const buffer = encode(image);
  const blob = new Blob([buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return (
    <RoiContainer target={<img src={url} style={{ display: 'block' }} />}>
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
      origin: { row: y * imageHeight, column: x * imageWidth },
      width,
      height,
      out: image,
    });
  }
  const buffer = encode(image);
  const blob = new Blob([buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return (
    <img
      src={url}
      style={{ width: imageWidth, height: imageHeight, padding: '10px' }}
    />
  );
}
