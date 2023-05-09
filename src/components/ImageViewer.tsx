import { Image, writeCanvas } from 'image-js';
import { useContext, useEffect, useRef, useState } from 'react';
import { BoxAnnotation } from './BoxAnnotation';
import { DragContext } from '../context/DragContext';
import { Point } from '../types/Point';
import { getRectangle } from '../utilities/getRectangle';
import './css/ImageViewer.css';

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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Point>({ x: 0, y: 0 });
  const [delta, setDelta] = useState({ width: 1, height: 1 });
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  const rect = {
    offsetLeft: divRef.current?.offsetLeft || 0,
    offsetTop: divRef.current?.offsetTop || 0,
  };
  function onMouseDown(event: React.MouseEvent) {
    setIsMouseDown(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
    setCurrentPosition({ x: event.clientX, y: event.clientY });
  }

  function onMouseUp(event: React.MouseEvent) {
    setIsMouseDown(false);
    setStartPosition({ x: event.clientX, y: event.clientY });
    setCurrentPosition({ x: event.clientX, y: event.clientY });
    dispatch({
      type: 'addDragObject',
      payload: {
        id: Math.random(),
        selected: false,
        rectangle: getRectangle(startPosition, currentPosition, delta, rect),
      },
    });
  }

  function onMouseMove(event: React.MouseEvent) {
    if (isMouseDown) {
      setCurrentPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function onMouseUpOutside() {
    setIsMouseDown(false);
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
          setDelta({
            width: width / entry.contentRect.width,
            height: height / entry.contentRect.height,
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

  const rectangle = getRectangle(startPosition, currentPosition, delta, rect);

  let boxes = state.objects.map((obj) => (
    <BoxAnnotation key={obj.id} rectangle={obj.rectangle} />
  ));

  let annotations = [
    <BoxAnnotation
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
