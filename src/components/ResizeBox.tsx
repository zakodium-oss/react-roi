import { ReactNode, useEffect, useRef, useState } from 'react';
import { Rectangle } from '../types/Rectangle';
import { DragObject } from '../context/DragContext';
import { Point } from '../types/Point';
import { getRectangle } from '../utilities/getRectangle';

export function ResizeBox({ children }: { children: JSX.Element }) {
  const childRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      console.log(childRef);
      console.log('Top:', rect.top);
      console.log('Left:', rect.left);
      console.log('Right:', rect.right);
      console.log('Bottom:', rect.bottom);
    }
  }, []);
  const rect = { top: 0, left: 0, right: 50, bottom: 50 };
  const width = 90;
  const height = 60;
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        border: '1px dashed black',
      }}
    >
      <Pointer
        data={{ top: `${rect.top - 5}px`, left: `${rect.left - 5}px` }}
      />
      <Pointer
        data={{ top: `${rect.top - 5}px`, right: `${rect.right - 5}px` }}
      />
      <Pointer
        data={{ bottom: `${rect.bottom - 5}px`, left: `${rect.left - 5}px` }}
      />
      <Pointer
        data={{ bottom: `${rect.bottom - 5}px`, right: `${rect.right - 5}px` }}
      />
      <Pointer data={{ top: '-5px', left: '50%' }} />
      <Pointer data={{ bottom: '-5px', left: '50%' }} />
      <Pointer data={{ top: '50%', left: '-5px' }} />
      <Pointer data={{ top: '50%', right: '-5px' }} />
      <div style={{ position: 'relative' }} ref={childRef}>
        {children}
      </div>
    </div>
  );
}

function Pointer({
  data = {},
}: {
  data: { top?: string; bottom?: string; left?: string; right?: string };
}) {
  const { top, bottom, right, left } = data;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        bottom,
        right,
        left,
        width: '10px',
        height: '10px',
        borderRadius: '20%',
        backgroundColor: '#44aaff',
      }}
    ></div>
  );
}

export function SizeContainer({
  rectangle,
  imageHeight,
}: {
  rectangle: Rectangle;
}) {
  const { height = 0, width = 0, origin = { column: 0, row: 0 } } = rectangle;
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Point>({ x: 0, y: 0 });
  const [delta, setDelta] = useState({ width: 1, height: 1 });

  function onMouseDown(event: React.MouseEvent) {
    setIsMouseDown(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
    setCurrentPosition({ x: event.clientX, y: event.clientY });
  }

  function onMouseUp(event: React.MouseEvent) {
    setIsMouseDown(false);
    setStartPosition({ x: event.clientX, y: event.clientY });
    setCurrentPosition({ x: event.clientX, y: event.clientY });
    // dispatch({
    //   type: 'addDragObject',
    //   payload: {
    //     id: Math.random(),
    //     selected: false,
    //     rectangle: getRectangle(startPosition, currentPosition, delta, rect),
    //   },
    // });
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
  }, [image]);

  const rectangle = getRectangle(startPosition, currentPosition, delta, rect);

  function onMouseMove(event: React.MouseEvent) {
    if (isMouseDown) {
      setCurrentPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  }
  return (
    <>
      <circle
        cx={origin.column}
        cy={origin.row}
        r={10}
        stroke="black"
        fill="#44aaff"
        style={{ zIndex: 1 }}
      ></circle>
      <circle
        cx={origin.column}
        cy={origin.row + height}
        r={10}
        stroke="black"
        fill="#44aaff"
        style={{ zIndex: 1 }}
      ></circle>
      <circle
        cx={origin.column + width}
        cy={origin.row + height}
        r={10}
        stroke="black"
        fill="#44aaff"
        style={{ zIndex: 1 }}
      ></circle>
      <circle
        cx={origin.column + width}
        cy={origin.row}
        r={10}
        stroke="black"
        fill="#44aaff"
        style={{ zIndex: 1 }}
      ></circle>
      <rect
        x={origin.column}
        y={origin.row}
        width={width}
        height={height}
        style={{
          fill: 'transparent',
          stroke: '#44aaff',
          strokeWidth: 3,
          zIndex: 1,
        }}
      ></rect>
    </>
  );
}
