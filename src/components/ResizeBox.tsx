import { ReactNode } from 'react';

export function ResizeBox({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        border: '1px dashed black',
      }}
    >
      <Pointer data={{ top: '-5px', left: '-5px' }} />
      <Pointer data={{ top: '-5px', right: '-5px' }} />
      <Pointer data={{ bottom: '-5px', left: '-5px' }} />
      <Pointer data={{ bottom: '-5px', right: '-5px' }} />
      <Pointer data={{ top: '-5px', left: '50%' }} />
      <Pointer data={{ bottom: '-5px', left: '50%' }} />
      <Pointer data={{ top: '50%', left: '-5px' }} />
      <Pointer data={{ top: '50%', right: '-5px' }} />
      {children}
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
