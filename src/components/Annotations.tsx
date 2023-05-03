export function Annotations({
  annotations,
  width,
  height,
  imageRef,
}: {
  annotations: JSX.Element[];
  width: number;
  height: number;
  imageRef: React.RefObject<HTMLCanvasElement>;
}) {
  const imageWidth = imageRef?.current?.offsetWidth ?? "100%";
  const imageHeight = imageRef?.current?.offsetHeight ?? "100%";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: imageWidth,
        height: imageHeight,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={imageWidth}
        height={imageHeight}
        viewBox={`0 0 ${width} ${height}`}
      >
        {annotations}
      </svg>
      {/* <ResizeBox children={annotations[0]} width={300} height={200} /> */}
    </div>
  );
}
