import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';
import { DynamicActions, DynamicContext } from '../context/DynamicContext';

import './css/ImageComponent.css';
import { getScaledRectangle } from '../utilities/getScaledRectangle';
import { Ratio } from '../types/Ratio';

type ImageComponentProps = {
  image: Image;
  options?: {
    width?: number;
    height?: number;
    cursorSize?: number;
  };
};

export function ImageComponent({ image, options = {} }: ImageComponentProps) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const {
    width = image.width,
    height = image.height,
    cursorSize = 3,
  } = options;
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  // TODO: implement boundaries when the box is outside of the component.

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
    dynamicDispatch({
      type: 'setDynamicState',
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
    return;
  }, [image]);

  const resizeBox = (
    <ResizeBox key={`resize-box`} cursorSize={cursorSize}></ResizeBox>
  );
  const annotations = dynamicState.objects.map((obj, index) => {
    if (
      obj.id === dynamicState.objectID &&
      (dynamicState.action === DynamicActions.DRAG ||
        dynamicState.action === DynamicActions.RESIZE)
    ) {
      return null;
    }
    return (
      <BoxAnnotation
        id={obj.id}
        key={`annotation_${index}`}
        rectangle={getScaledRectangle(
          obj.rectangle,
          dynamicState.ratio as Ratio
        )}
      />
    );
  });

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseUp={(event) =>
        dynamicDispatch({ type: 'onMouseUp', payload: event })
      }
      onMouseMove={(event) =>
        dynamicDispatch({ type: 'onMouseMove', payload: event })
      }
      onMouseDown={(event) =>
        dynamicDispatch({ type: 'onMouseDown', payload: event })
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
