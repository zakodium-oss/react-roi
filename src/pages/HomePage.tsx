import { Image, encode } from 'image-js';
import { useState } from 'react';
import { ObjectInspector } from 'react-inspector';

import { RoiBox } from '../components/RoiBox';
import { RoiContainer } from '../components/RoiContainer';
import './css/HomePage.css';
import { RoiProvider } from '../context/RoiContext';
import { useRoiState } from '../hooks';
import { useRoiActions } from '../hooks/useRoiActions';
import { CommittedRoi } from '../types/CommittedRoi';
import { Roi } from '../types/Roi';

interface RoiData {
  blurMethod: 'pixelate' | 'blur' | 'fill';
}

const initialRois: Array<CommittedRoi<RoiData>> = [
  {
    id: crypto.randomUUID(),
    x: 152,
    y: 369,
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
  const state = useRoiState<RoiData>();
  const [editing, setEditing] = useState<boolean>(true);
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setEditing(!editing);
          }}
        >
          {`Go to ${editing ? 'result' : 'edit'}`}
        </button>
        <Toolbar />
        {editing ? <ImageWithRois /> : <TransformedImage />}
      </div>
      <ObjectInspector expandLevel={2} data={state} />
    </>
  );
}

function Toolbar() {
  const { mode, selectedRoi } = useRoiState<RoiData>();
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
          // Takes a new CommitedRoi<RoiData> as argument
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
          // Update the color of the selected ROI
          // First argument: roi to update (string)
          // Second argument: update data (Partial<CommitedRoi<RoiData>>)
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
          // Update the color of the selected ROI
          // First argument: roi to update (string)
          // Second argument: update data (Partial<CommitedRoi<RoiData>>)
          removeRoi(selectedRoi, {
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
        Remove
      </button>
    </div>
  );
}

function ImageWithRois() {
  // The type of rois is Roi<RoiData>[]
  const { rois } = useRoiState<RoiData>() as { rois: Array<Roi<RoiData>> };
  const image = new Image(1000, 800).fill(255);
  image.drawRectangle({ out: image });
  image.drawCircle({ column: 500, row: 400 }, 400, { out: image });
  const buffer = encode(image);
  const blob = new Blob([buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return (
    // This component renders the target image and all the ROIs
    // it throws if rendered without an explicit provider on top of it
    // And handles the mouse interactions to edit the rois
    // It's possible to disable edition interactions by setting the readOnly prop to true
    <RoiContainer
      target={<img src={url} />}
      // target={<div style={{ width: 1000, height: 800, background: 'grey' }} />}
      options={{ containerWidth: 800, containerHeight: 500 }}
    >
      {rois.map((roi) => (
        <RoiBox key={roi.id} roi={roi} />
      ))}
    </RoiContainer>
  );
}

function TransformedImage() {
  // The api provides a different list of ROIs, which only changes when the movement
  // of an roi is finished (so when the user releases the mouse after moving or resizing)
  // The shape of the roi objects are the same which need to be fed as initial values to the RoiProvider
  // The type of commitedRois is CommitedRoi<RoiData>[]
  const image = new Image(1000, 800).fill(255);
  image.drawRectangle({ out: image });
  image.drawCircle({ column: 500, row: 400 }, 400, { out: image });
  const { rois } = useRoiState<RoiData>();
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
  // e.g. create the pseudonymized image in an effect
  return <img src={url} style={{ width: 1000, height: 800 }} />;
  // the result of this hook can also be used to send the ROIs to the backend
}
