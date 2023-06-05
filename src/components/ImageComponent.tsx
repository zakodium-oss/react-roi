import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';
import { onMouseMove } from './callbacks/onMouseMove';
import { onMouseDown } from './callbacks/onMouseDown';
import { onMouseUp } from './callbacks/onMouseUp';
import { ObjectContext } from '../context/ObjectContext';
import { DynamicActions, DynamicContext } from '../context/DynamicContext';

import './css/ImageComponent.css';

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
  const { objectState, objectDispatch } = useContext(ObjectContext);
  const {
    width = image.width,
    height = image.height,
    cursorSize = 5,
  } = options;
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  // TODO: implement boundaries when the box is outside of the component.
  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [image]);

  // TODO: implement boundaries when the box is outside of the component.
  useEffect(() => {
    dynamicDispatch({
      type: 'setRatio',
      payload: {
        x: (imageRef.current?.width as number) / width,
        y: (imageRef.current?.height as number) / height,
      },
    });
    dynamicDispatch({
      type: 'setOffset',
      payload: {
        top: divRef.current?.offsetTop || 0,
        left: divRef.current?.offsetLeft || 0,
        right: 0,
        bottom: 0,
      },
    });
    return;
  }, [image]);

  const resizeBox = (
    <ResizeBox key={`resize-box`} cursorSize={cursorSize}></ResizeBox>
  );
  const annotations = objectState.objects.map((obj, index) => {
    if (
      obj.id === dynamicState.objectID &&
      (dynamicState.action === DynamicActions.DRAG ||
        dynamicState.action === DynamicActions.RESIZE)
    ) {
      return null;
    }
    return (
      <BoxAnnotation
        objectID={obj.id}
        key={`annotation_${index}`}
        rectangle={obj.rectangle}
        onMouseUp={() =>
          dynamicDispatch({ type: 'setAction', payload: DynamicActions.SLEEP })
        }
      />
    );
  });

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseUp={(event) =>
        onMouseUp(
          event,
          objectState,
          objectDispatch,
          dynamicState,
          dynamicDispatch
        )
      }
      onMouseMove={(event) =>
        onMouseMove(event, dynamicState, dynamicDispatch, objectState)
      }
      onMouseDown={(event) =>
        onMouseDown(event, objectState, dynamicState, dynamicDispatch)
      }
    >
      <canvas ref={imageRef} style={{ width: `${width}px`, height }} />
      {annotations !== undefined ? (
        <svg
          style={{ width: `${width}px`, height }}
          className="svg"
          viewBox={`0 0 ${width} ${height}`}
        >
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
