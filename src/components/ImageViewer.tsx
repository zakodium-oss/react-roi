import { useContext, useEffect, useReducer, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import { DragContext } from '../context/DragContext';
import { Point } from '../types/Point';
import { getRectangle } from '../utilities/getRectangle';
import './css/ImageViewer.css';
import { ResizeBox } from './ResizeBox';
import { eventReducer } from '../context/EventReducer';

const intialEventState = {
  isMouseDown: false,
  startPosition: { x: 0, y: 0 },
  currentPosition: { x: 0, y: 0 },
  delta: { width: 1, height: 1 },
  object: 0,
  resizerState: { active: false, id: undefined, position: 0 },
};

export function ImageViewer({
  image,
  options = {},
}: {
  image: Image;
  options?: {
    width?: number;
    height?: number;
  };
}) {
  const { state, dispatch } = useContext(DragContext);
  const { width = image.width, height = image.height } = options;
  const [eventState, eventDispatch] = useReducer(
    eventReducer,
    intialEventState
  );
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  const rect = {
    offsetLeft: divRef.current?.offsetLeft || 0,
    offsetTop: divRef.current?.offsetTop || 0,
  };

  function onMouseDown(event: React.MouseEvent) {
    eventDispatch({ type: 'setIsMouseDown', payload: true });
    if (!eventState.resizerState.active) {
      eventDispatch({
        type: 'setStartPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    }
    eventDispatch({
      type: 'setCurrentPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
  }

  function onMouseUp(event: React.MouseEvent) {
    if (eventState.resizerState.active) {
      const objIndex = state.objects.findIndex(
        (obj) => obj.id === eventState.resizerState.id
      );
      state.objects[objIndex].rectangle = getRectangle(
        getRectangleFromPoints(
          eventState.startPosition,
          eventState.currentPosition
        ),
        eventState.delta,
        rect
      );
      eventDispatch({
        type: 'setResizerState',
        payload: { active: false, id: undefined, position: 0 },
      });
      dispatch({ type: 'updateState', payload: state });
      eventDispatch({
        type: 'setStartPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
      eventDispatch({
        type: 'setCurrentPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    } else {
      dispatch({
        type: 'addDragObject',
        payload: {
          id: Math.random(),
          selected: false,
          rectangle: getRectangle(
            getRectangleFromPoints(
              eventState.startPosition,
              eventState.currentPosition
            ),
            eventState.delta,
            rect
          ),
        },
      });
      eventDispatch({ type: 'setIsMouseDown', payload: false });
      eventDispatch({
        type: 'setStartPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
      eventDispatch({
        type: 'setCurrentPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    }
  }

  function onMouseMove(event: React.MouseEvent) {
    if (eventState.isMouseDown) {
      eventDispatch({
        type: 'setCurrentPosition',
        payload: { x: event.clientX, y: event.clientY },
      });
    }
  }

  function onMouseUpOutside() {
    eventDispatch({ type: 'setIsMouseDown', payload: false });
    // TODO: Find out how to handle events outside of boundaries
    // const x =
    //   event.clientX > width / delta.width ? width / delta.width : event.clientX;
    // const y =
    //   event.clientY > height / delta.height
    //     ? height / delta.height
    //     : event.clientY;
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === imageRef.current) {
          eventDispatch({
            type: 'setDelta',
            payload: {
              width: width / entry.contentRect.width,
              height: height / entry.contentRect.height,
            },
          });
        }
      }
    });
    window.addEventListener('mouseup', onMouseUpOutside);
    if (imageRef.current) resizeObserver.observe(imageRef.current);
    return () => {
      if (imageRef.current) resizeObserver.unobserve(imageRef.current);
      window.removeEventListener('mouseup', onMouseUpOutside);
    };
  }, [image]);

  function getRectangleFromPoints(p0: Point, p1: Point) {
    return {
      origin: { column: p0.x, row: p0.y },
      width: p1.x - p0.x,
      height: p1.y - p0.y,
    };
  }

  const rectangle = getRectangle(
    getRectangleFromPoints(
      eventState.startPosition,
      eventState.currentPosition
    ),
    eventState.delta,
    rect
  );

  let boxes = state.objects.map((obj, index) => (
    <BoxAnnotation
      id={obj.id}
      key={`annotation_${index}`}
      rectangle={obj.rectangle}
      callback={eventDispatch}
    />
  ));

  let annotations = [
    <BoxAnnotation
      id={`new_rect`}
      rectangle={rectangle}
      key={'new_rect'}
      options={{
        fill: 'transparent',
        stroke: '#44aaff',
        strokeWidth: 2,
        strokeDasharray: 5,
        strokeDashoffset: 5,
        zIndex: 1,
      }}
    />,
    ...boxes,
    <ResizeBox
      id={eventState.object}
      rectangle={rectangle}
      eventState={eventState}
      eventDispatch={eventDispatch}
      delta={eventState.delta}
      rect={rect}
    ></ResizeBox>,
  ];

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [image]);

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
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
