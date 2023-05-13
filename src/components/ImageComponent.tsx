import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { DragContext } from '../context/DragContext';
import { getRectangle } from '../utilities/getRectangle';
import './css/ImageViewer.css';
import { ResizeBox } from './ResizeBox';
import { dragObject } from './callbacks/dragObject';
import { observeResizing } from './callbacks/observeResizing';
import { onMouseMove } from './callbacks/onMouseMove';
import { onMouseDown } from './callbacks/onMouseDown';
import { onMouseUp } from './callbacks/onMouseUp';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { onMouseUpOutside } from './callbacks/onMouseUpOutside';

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
  const { state, dispatch, eventState, eventDispatch } =
    useContext(DragContext);
  const { width = image.width, height = image.height } = options;

  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);
  const rect = {
    offsetLeft: divRef.current?.offsetLeft || 0,
    offsetTop: divRef.current?.offsetTop || 0,
  };

  const componentState = {
    contextState: state,
    contextDispatch: dispatch,
    eventState,
    eventDispatch,
  };

  const objIndex = state.objects.findIndex(
    (obj) => obj.id === eventState.object
  );
  const object = state.objects[objIndex];
  const rectangle = getRectangle(
    getRectangleFromPoints(
      eventState.startPosition,
      eventState.currentPosition
    ),
    eventState.delta,
    rect
  );

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [image]);

  useEffect(() => {
    window.addEventListener('mouseup', () => onMouseUpOutside(componentState));
    const resizeObserver = observeResizing(
      imageRef,
      width,
      height,
      eventDispatch
    );
    if (imageRef.current) resizeObserver.observe(imageRef.current);
    return () => {
      if (imageRef.current) resizeObserver.unobserve(imageRef.current);
      window.removeEventListener('mouseup', () =>
        onMouseUpOutside(componentState)
      );
    };
  }, [image]);

  let annotations = [
    <ResizeBox
      id={eventState.object as number | string}
      key={`resize-box`}
      object={object}
      rectangle={rectangle}
      eventState={eventState}
      eventDispatch={eventDispatch}
      delta={eventState.delta}
      rect={rect}
    ></ResizeBox>,
    ...state.objects.map((obj, index) => (
      <BoxAnnotation
        id={obj.id}
        key={`annotation_${index}`}
        rectangle={obj.rectangle}
        onMouseDown={(event) => dragObject(event, obj.id, rect, componentState)}
        // onClick={(event) => dragObject(event, obj.id, rect, componentState)}
        onMouseUp={() =>
          eventDispatch({ type: 'setIsMouseDown', payload: false })
        }
        callback={eventDispatch}
      />
    )),
  ];

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseDown={(event) => onMouseDown(event, rect, componentState)}
      onMouseUp={(event) => onMouseUp(event, object, rect, componentState)}
      onMouseMove={(event) => onMouseMove(event, rect, componentState)}
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
