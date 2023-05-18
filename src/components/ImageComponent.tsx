import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { getRectangle } from '../utilities/getRectangle';
import './css/ImageComponent.css';
import { ResizeBox } from './ResizeBox';
import { selectObject } from './callbacks/selectObject';
import { observeResizing } from './callbacks/observeResizing';
import { onMouseMove } from './callbacks/onMouseMove';
import { onMouseDown } from './callbacks/onMouseDown';
import { onMouseUp } from './callbacks/onMouseUp';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { PositionContext } from '../context/PositionContext';
import { ObjectContext } from '../context/ObjectContext';
import { DynamicContext } from '../context/DynamicContext';

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

  const rectangle = getRectangle(
    getRectangleFromPoints(positionState.startPoint, positionState.endPoint),
    positionState.delta,
    rect
  );

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [image]);

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

  const object = positionState.object;
  let annotations = [
    ...objectState.objects.map((obj, index) => (
      <BoxAnnotation
        object={object}
        key={`annotation_${index}`}
        rectangle={obj.rectangle}
        positionDispatch={positionDispatch}
        dynamicDispatch={dynamicDispatch}
        onMouseDown={(event) =>
          selectObject(
            obj,
            event,
            rect,
            positionState,
            positionDispatch,
            dynamicDispatch
          )
        }
        onMouseUp={() =>
          dynamicDispatch({ type: 'setIsMouseDown', payload: false })
        }
      />
    )),
    <ResizeBox
      key={`resize-box`}
      object={object}
      rectangle={rectangle}
      positionState={positionState}
      positionDispatch={positionDispatch}
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
          object,
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
          object,
          rect,
          positionState,
          dynamicState,
          positionDispatch
        )
      }
      onMouseDown={(event) =>
        onMouseDown(event, positionDispatch, dynamicState, dynamicDispatch)
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
