import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';
import { observeResizing } from './callbacks/observeResizing';
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
  };
};

export function ImageComponent({ image, options = {} }: ImageComponentProps) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { objectState, objectDispatch } = useContext(ObjectContext);
  const { width = image.width, height = image.height } = options;
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [image]);

  // TODO: implement boundaries when the box is outside of the component.
  useEffect(() => {
    const resizeObserver = observeResizing(
      imageRef,
      width,
      height,
      dynamicDispatch
    );
    if (imageRef.current) resizeObserver.observe(imageRef.current);
    dynamicDispatch({
      type: 'setOffset',
      payload: {
        top: divRef.current?.offsetTop || 0,
        left: divRef.current?.offsetLeft || 0,
        right: 0,
        bottom: 0,
      },
    });
    return () => {
      if (imageRef.current) resizeObserver.unobserve(imageRef.current);
    };
  }, [image]);

  const resizeBox = <ResizeBox key={`resize-box`}></ResizeBox>;
  const annotations = objectState.objects.map((obj, index) => {
    if (
      obj.selected &&
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
        onMouseDown(
          event,
          objectState,
          objectDispatch,
          dynamicState,
          dynamicDispatch
        )
      }
    >
      <canvas ref={imageRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      {annotations !== undefined ? (
        <svg className="svg" viewBox={`0 0 ${width} ${height}`}>
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
