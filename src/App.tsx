import { decode, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

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

const imgUrl = '/barbara.jpg';

const initialRois: Array<CommittedRoi<RoiData>> = [
  {
    id: crypto.randomUUID(),
    label: (
      <div
        style={{
          color: 'white',
          backgroundColor: 'transparent',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          fontSize: '12px',
        }}
      >
        Styled label
      </div>
    ),
    x: 0,
    y: 0,
    width: 0.5,
    height: 0.5,
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
    <RoiProvider initialRois={initialRois}>
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
            gap: 12,
            alignItems: 'start',
            width: '100%',
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <ImageWithRois />
          </div>

          <TransformedImage />
        </div>
      </div>
    </RoiProvider>
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
  return (
    <div style={{ maxWidth: 800, border: 'solid 5px gray' }}>
      <RoiContainer target={<ImageSource />}>
        <RoiList />
      </RoiContainer>
    </div>
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
  const ref = useRef();
  const rois = useCommitedRois<RoiData>();
  useEffect(() => {
    fetch(imgUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const image = decode(new DataView(buffer));
        // image.convertColor('RGBA', { out: image });
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
      })
      .catch((error) => {
        reportError(error);
      });
  }, [rois]);

  return <canvas ref={ref} id="transformed-image" />;
}

function ImageSource() {
  const ref = useRef();

  useEffect(() => {
    fetch('/barbara.jpg')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const image = decode(new DataView(buffer));
        writeCanvas(image, ref.current);
      })
      .catch((error) => {
        reportError(error);
      });
  }, []);

  return <canvas ref={ref} style={{ width: '100%', display: 'block' }} />;
}
