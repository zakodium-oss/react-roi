import { Image, writeCanvas } from "image-js";
import { useContext, useEffect, useRef, useState } from "react";
import { BoxAnnotation } from "./BoxAnnotation";
import { Rectangle } from "../types/Rectangle";
import { DragContext } from "../context/DragContext";
import { ResizeBox } from "./ResizeBox";

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
  const imageRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Point>({ x: 0, y: 0 });
  const rect = document.getElementById("draggable")?.getBoundingClientRect();

  console.log(state);

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
      type: "addDragObject",
      payload: {
        id: Math.random(),
        selected: true,
        rectangle: swap(rect as DOMRect, startPosition, currentPosition),
      },
    });
  }

  function onMouseMove(event: React.MouseEvent) {
    if (isMouseDown) {
      setCurrentPosition({ x: event.clientX, y: event.clientY });
    }
  }

  const rectangle = swap(rect as DOMRect, startPosition, currentPosition);

  let boxes = state.objects.map((obj) => (
    <BoxAnnotation key={obj.id} rectangle={obj.rectangle} />
  ));

  let annotations = [
    <BoxAnnotation
      rectangle={rectangle}
      options={{
        fill: "transparent",
        stroke: "#44aaff",
        strokeWidth: 2,
        strokeDasharray: "5",
        strokeDashoffset: 5,
      }}
    />,
    ...boxes,
  ];

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
  }, [imageRef, image]);

  return (
    <div
      id="draggable"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{
        position: "relative",
        margin: "10px",
        width: "50%",
        height: "50%",
      }}
    >
      <canvas ref={imageRef} style={{ maxWidth: "100%" }} />
      {annotations !== undefined ? (
        <Annotations annotations={annotations} width={width} height={height} />
      ) : null}
    </div>
  );
}

function Annotations({
  annotations,
  width,
  height,
}: {
  annotations: JSX.Element[];
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width}px ${height}px`}
      >
        {annotations}
      </svg>
      {/* <ResizeBox children={annotations[0]} width={300} height={200} /> */}
    </div>
  );
}

type Point = {
  x: number;
  y: number;
};

function swap(rect: DOMRect, p0: Point, p1: Point): Rectangle {
  let result = {
    height: 0,
    origin: { row: 0, column: 0 },
    width: 0,
  };
  if (p0.x < p1.x && p0.y < p1.y) {
    result = {
      origin: { column: p0.x - rect.left, row: p0.y - rect.top },
      width: p1.x - p0.x,
      height: p1.y - p0.y,
    };
  } else if (p1.x > p0.x && p1.y < p0.y) {
    result = {
      origin: { column: p0.x - rect.left, row: p1.y - rect.top },
      width: p1.x - p0.x,
      height: p0.y - p1.y,
    };
  } else if (p0.x > p1.x && p0.y > p1.y) {
    result = {
      origin: { column: p1.x - rect.left, row: p1.y - rect.top },
      width: p0.x - p1.x,
      height: p0.y - p1.y,
    };
  } else if (p1.x < p0.x && p1.y > p0.y) {
    result = {
      origin: { column: p1.x - rect.left, row: p0.y - rect.top },
      width: p0.x - p1.x,
      height: p1.y - p0.y,
    };
  }
  return result;
}
