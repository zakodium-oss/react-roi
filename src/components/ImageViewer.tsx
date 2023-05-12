import { useContext, useEffect, useReducer, useRef } from 'react';

import { Image, writeCanvas } from 'image-js';

import { BoxAnnotation } from './BoxAnnotation';
import {
  Actions,
  DragContext,
  DragObject,
  DragState,
} from '../context/DragContext';
import { Point } from '../types/Point';
import { getRectangle } from '../utilities/getRectangle';
import './css/ImageViewer.css';
import { ResizeBox } from './ResizeBox';
import { EventActions, EventStateType } from '../context/EventReducer';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';
import { Rectangle } from '../types/Rectangle';

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
    (obj) => obj.id === eventState.setChangeState.id
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
    ...state.objects.map((obj, index) => (
      <BoxAnnotation
        id={obj.id}
        key={`annotation_${index}`}
        rectangle={obj.rectangle}
        onMouseDown={(event) => dragObject(event, obj.id, rect, componentState)}
        callback={eventDispatch}
      />
    )),
    <ResizeBox
      id={eventState.object}
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
      onMouseDown={(event) => onMouseDown(event, componentState)}
      onMouseUp={(event) => onMouseUp(event, object, rect, componentState)}
      onMouseMove={(event) => onMouseMove(event, componentState)}
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

function dragObject(
  event: React.MouseEvent,
  id: string | number,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  console.log('......... onDrag');
  const { contextState, eventState, eventDispatch } = componentState;
  const objIndex = contextState.objects.findIndex((obj) => obj.id === id);
  const object = contextState.objects[objIndex];
  const points = getReferencePointers(
    object.rectangle,
    eventState.delta,
    0,
    rect
  );
  eventDispatch({
    type: 'setChangeState',
    payload: { drag: true, resize: false, position: 0, id: eventState.object },
  });

  eventDispatch({
    type: 'setStartPosition',
    payload: { x: points?.p0.x || 0, y: points?.p0.y || 0 },
  });
  eventDispatch({
    type: 'setCurrentPosition',
    payload: { x: points?.p1.x || 0, y: points!?.p1.y || 0 },
  });
}

function observeResizing(
  imageRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  eventDispatch: (value: EventActions) => void
) {
  return new ResizeObserver((entries) => {
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
}

function onMouseMove(
  event: React.MouseEvent,
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState } = componentState;
  if (eventState.isMouseDown) {
    eventDispatch({
      type: 'setCurrentPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
  }
}

function onMouseUpOutside(componentState: {
  contextState: DragState;
  contextDispatch: React.Dispatch<Actions>;
  eventState: EventStateType;
  eventDispatch: React.Dispatch<EventActions>;
}) {
  const { eventDispatch } = componentState;
  eventDispatch({ type: 'setIsMouseDown', payload: false });
  // TODO: Find out how to handle events outside of boundaries
  // const x =
  //   event.clientX > width / delta.width ? width / delta.width : event.clientX;
  // const y =
  //   event.clientY > height / delta.height
  //     ? height / delta.height
  //     : event.clientY;
}

function onMouseDown(
  event: React.MouseEvent,
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState } = componentState;
  eventDispatch({ type: 'setIsMouseDown', payload: true });
  if (!eventState.setChangeState.resize) {
    eventDispatch({
      type: 'setStartPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
  } else if (!eventState.setChangeState.drag) {
    // eventDispatch({
    //   type: 'setStartPosition',
    //   payload: { x: event.clientX, y: event.clientY },
    // });
  }
  eventDispatch({
    type: 'setCurrentPosition',
    payload: { x: event.clientX, y: event.clientY },
  });
}

function onMouseUp(
  event: React.MouseEvent,
  object: DragObject,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  componentState: {
    contextState: DragState;
    contextDispatch: React.Dispatch<Actions>;
    eventState: EventStateType;
    eventDispatch: React.Dispatch<EventActions>;
  }
) {
  const { eventDispatch, eventState, contextDispatch } = componentState;
  if (eventState.setChangeState.resize) {
    object.rectangle = getRectangle(
      getRectangleFromPoints(
        eventState.startPosition,
        eventState.currentPosition
      ),
      eventState.delta,
      rect
    );
    eventDispatch({
      type: 'setChangeState',
      payload: { resize: false, drag: false, id: undefined, position: 0 },
    });
    eventDispatch({
      type: 'setStartPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
    eventDispatch({
      type: 'setCurrentPosition',
      payload: { x: event.clientX, y: event.clientY },
    });
    // } else if (eventState.setChangeState.drag) {
    //   object.rectangle = getRectangle(
    //     traslateRectangle(
    //       object.rectangle,
    //       //structuredClone(object.rectangle),
    //       eventState.currentPosition
    //     ),
    //     eventState.delta,
    //     rect
    //   );
    //   eventDispatch({
    //     type: 'setChangeState',
    //     payload: { resize: false, drag: false, id: undefined, position: 0 },
    //   });
    //   // eventDispatch({
    //   //   type: 'setStartPosition',
    //   //   payload: { x: event.clientX, y: event.clientY },
    //   // });
    //   eventDispatch({
    //     type: 'setCurrentPosition',
    //     payload: { x: event.clientX, y: event.clientY },
    //   });
  } else {
    contextDispatch({
      type: 'addObject',
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

function getRectangleFromPoints(p0: Point, p1: Point) {
  return {
    origin: { column: p0.x, row: p0.y },
    width: p1.x - p0.x,
    height: p1.y - p0.y,
  };
}

function traslateRectangle(
  rectangle: Rectangle,
  point: { x: number; y: number }
) {
  return {
    origin: { column: point.x, row: point.y },
    width: rectangle.width,
    height: rectangle.height,
  };
}
