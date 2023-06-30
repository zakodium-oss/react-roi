import { Image, writeCanvas } from 'image-js';
import { useContext, useEffect, useRef } from 'react';
import { useKbsGlobal } from 'react-kbs';

import { DynamicActions, DynamicContext } from '../context/DynamicContext';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { ResizeBox } from './ResizeBox';

import './css/ImageComponent.css';

type ImageComponentProps = {
  image: Image;
  options?: {
    width?: number;
    height?: number;
    cursorSize?: number;
  };
};

export function ImageComponent({ image, options = {} }: ImageComponentProps) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const {
    width = image.width,
    height = image.height,
    cursorSize = 3,
  } = options;
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  // TODO: implement boundaries when the box is outside of the component.

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current as HTMLCanvasElement);
    dynamicDispatch({
      type: 'setDynamicState',
      payload: {
        ratio: {
          x: (imageRef.current?.width as number) / width,
          y: (imageRef.current?.height as number) / height,
        },
        offset: {
          top: divRef.current?.offsetTop || 0,
          left: divRef.current?.offsetLeft || 0,
          right: 0,
          bottom: 0,
        },
        width,
        height,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted && dynamicState.objectID) {
          dynamicDispatch({
            type: 'removeObject',
            payload: dynamicState.objectID,
          });
        }
      },
    },
  ]);

  const resizeBox = <ResizeBox key={`resize-box`} cursorSize={cursorSize} />;
  const annotations = dynamicState.objects.map((obj) => {
    if (
      obj.id === dynamicState.objectID &&
      (dynamicState.action === DynamicActions.DRAG ||
        dynamicState.action === DynamicActions.RESIZE)
    ) {
      return null;
    }
    return (
      <BoxAnnotation
        id={obj.id}
        key={obj.id}
        rectangle={getScaledRectangle(obj.rectangle, dynamicState.ratio)}
        options={obj.options}
      />
    );
  });

  return (
    <div
      id="draggable"
      ref={divRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseUp={(event) =>
        dynamicDispatch({ type: 'onMouseUp', payload: event })
      }
      onMouseMove={(event) =>
        dynamicDispatch({ type: 'onMouseMove', payload: event })
      }
      onMouseDown={(event) =>
        dynamicDispatch({ type: 'onMouseDown', payload: event })
      }
    >
      <canvas
        ref={imageRef}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      {annotations !== undefined ? (
        <svg
          style={{ width: `${width}px`, height: `${height}px` }}
          className="svg"
          viewBox={`0 0 ${width} ${height}`}
        >
          {[...annotations, resizeBox]}
        </svg>
      ) : null}
    </div>
  );
}
