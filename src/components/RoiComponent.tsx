import { Image, writeCanvas } from 'image-js';
import { useContext, useEffect, useRef } from 'react';
import { useKbsGlobal } from 'react-kbs';

import { RoiActions, RoiContext } from '../context/RoiContext';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';

import './css/ImageComponent.css';

type ImageComponentProps = {
  image: Image;
  options?: {
    width?: number;
    height?: number;
    cursorSize?: number;
  };
};

export function RoiComponent({ image, options = {} }: ImageComponentProps) {
  const { roiState, roiDispatch } = useContext(RoiContext);
  const {
    width = image.width,
    height = image.height,
    cursorSize = 3,
  } = options;
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
    roiDispatch({
      type: 'setRoiState',
      payload: {
        ratio: {
          x: (imageRef.current?.width as number) / width,
          y: (imageRef.current?.height as number) / height,
        },
        offset: {
          top: divRef.current?.offsetTop || 0,
          left: divRef.current?.offsetLeft || 0,
          right: 0,
          bottom: 0,
        },
        width,
        height,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted && roiState.roiID) {
          roiDispatch({
            type: 'removeRoi',
            payload: roiState.roiID,
          });
        }
      },
    },
  ]);

  const resizeBox = <ResizeBox key={`resize-box`} cursorSize={cursorSize} />;
  const annotations = roiState.rois.map((obj) => {
    if (
      obj.id === roiState.roiID &&
      (roiState.action === RoiActions.DRAG ||
        roiState.action === RoiActions.RESIZE)
    ) {
      return null;
    }
    return (
      <BoxAnnotation
        id={obj.id}
        key={obj.id}
        rectangle={getScaledRectangle(obj.rectangle, roiState.ratio)}
        options={obj.meta}
      />
    );
  });

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseUp={(event) => roiDispatch({ type: 'onMouseUp', payload: event })}
      onMouseMove={(event) =>
        roiDispatch({ type: 'onMouseMove', payload: event })
      }
      onMouseDown={(event) =>
        roiDispatch({ type: 'onMouseDown', payload: event })
      }
    >
      <canvas
        ref={imageRef}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      {annotations !== undefined ? (
        <svg
          style={{ width: `${width}px`, height: `${height}px` }}
          className="svg"
          viewBox={`0 0 ${width} ${height}`}
        >
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
