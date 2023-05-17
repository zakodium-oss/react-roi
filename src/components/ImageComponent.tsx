import { useContext, useEffect, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { DataContext } from '../context/DataContext';
import { getRectangle } from '../utilities/getRectangle';
import './css/ImageComponent.css';
import { ResizeBox } from './ResizeBox';
import { selectObject } from './callbacks/selectObject';
import { observeResizing } from './callbacks/observeResizing';
import { onMouseMove } from './callbacks/onMouseMove';
import { onMouseDown } from './callbacks/onMouseDown';
import { onMouseUp } from './callbacks/onMouseUp';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { onMouseUpOutside } from './callbacks/onMouseUpOutside';
import { DrawActions } from '../context/EventReducer';

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
    useContext(DataContext);
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

  const rectangle = getRectangle(
    getRectangleFromPoints(eventState.startPoint, eventState.currentPoint),
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

  const object = eventState.object;
  let annotations = [
    ...state.objects.map((obj, index) => (
      <BoxAnnotation
        object={object}
        key={`annotation_${index}`}
        rectangle={obj.rectangle}
        callback={eventDispatch}
        state={eventState}
        onMouseDown={(event) => selectObject(obj, event, rect, componentState)}
        onMouseUp={() =>
          eventDispatch({ type: 'setIsMouseDown', payload: false })
        }
      />
    )),
    <ResizeBox
      key={`resize-box`}
      object={object}
      rectangle={rectangle}
      eventState={eventState}
      eventDispatch={eventDispatch}
      delta={eventState.delta}
      rect={rect}
    ></ResizeBox>,
  ];

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseUp={(event) => onMouseUp(event, object, rect, componentState)}
      onMouseMove={(event) => onMouseMove(event, object, rect, componentState)}
      onMouseDown={(event) => onMouseDown(event, componentState)}
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
