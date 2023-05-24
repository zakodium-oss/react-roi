import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';
import { selectObject } from './callbacks/selectObject';
import { observeResizing } from './callbacks/observeResizing';
import { onMouseMove } from './callbacks/onMouseMove';
import { onMouseDown } from './callbacks/onMouseDown';
import { onMouseUp } from './callbacks/onMouseUp';
import { PositionContext } from '../context/PositionContext';
import { ObjectContext } from '../context/ObjectContext';
import { DynamicContext } from '../context/DynamicContext';
import './css/ImageComponent.css';

export function ImageComponent({
  image,
  options = {},
}: {
  image: Image;
  options?: {
    width?: number;
    height?: number;
  };
}) {
  const { positionState, positionDispatch } = useContext(PositionContext);
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { objectState, objectDispatch } = useContext(ObjectContext);
  const { width = image.width, height = image.height } = options;
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);
  const rect = {
    offsetLeft: divRef.current?.offsetLeft || 0,
    offsetTop: divRef.current?.offsetTop || 0,
  };

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [image]);

  // TODO: implement boundaries when the box is outside of the component.
  useEffect(() => {
    // window.addEventListener('mouseup', () => onMouseUpOutside(componentState));
    const resizeObserver = observeResizing(
      imageRef,
      width,
      height,
      positionDispatch
    );
    if (imageRef.current) resizeObserver.observe(imageRef.current);
    return () => {
      if (imageRef.current) resizeObserver.unobserve(imageRef.current);
      // window.removeEventListener('mouseup', () =>
      //   onMouseUpOutside(componentState)
      // );
    };
  }, [image]);

  const annotations = [
    ...objectState.objects.map((obj, index) => (
      <BoxAnnotation
        objectID={obj.id}
        key={`annotation_${index}`}
        rectangle={obj.rectangle}
        rect={rect}
        objectState={objectState}
        objectDispatch={objectDispatch}
        positionDispatch={positionDispatch}
        positionState={positionState}
        dynamicDispatch={dynamicDispatch}
        onMouseDown={(event) => {
          selectObject(
            obj.id,
            event,
            rect,
            objectState,
            objectDispatch,
            positionState,
            dynamicState,
            dynamicDispatch
          );
        }}
        onMouseUp={() =>
          dynamicDispatch({ type: 'setIsMouseDown', payload: false })
        }
      />
    )),
    <ResizeBox
      key={`resize-box`}
      objectState={objectState}
      objectDispatch={objectDispatch}
      positionState={positionState}
      positionDispatch={positionDispatch}
      dynamicState={dynamicState}
      dynamicDispatch={dynamicDispatch}
      delta={positionState.delta}
      rect={rect}
    ></ResizeBox>,
  ];

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseUp={(event) =>
        onMouseUp(
          event,
          rect,
          objectState,
          objectDispatch,
          positionState,
          positionDispatch,
          dynamicState,
          dynamicDispatch
        )
      }
      onMouseMove={(event) =>
        onMouseMove(
          event,
          rect,
          dynamicState,
          objectState,
          positionState,
          positionDispatch
        )
      }
      onMouseDown={(event) =>
        onMouseDown(
          event,
          rect,
          objectState,
          objectDispatch,
          positionState,
          positionDispatch,
          dynamicState,
          dynamicDispatch
        )
      }
    >
      <canvas ref={imageRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      {annotations !== undefined ? (
        <svg className="svg" viewBox={`0 0 ${width} ${height}`}>
          {annotations}
        </svg>
      ) : null}
    </div>
  );
}
