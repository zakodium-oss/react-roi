import { Image } from 'image-js';
import { useContext } from 'react';
import { useKbsGlobal } from 'react-kbs';

import { RoiDispatchContext } from '../context/RoiContext';

import { ElementWrapper } from './ElementWrapper';
import { ImageWrapper } from './ImageWrapper';

type RoiComponentOptions = {
  width?: number;
  height?: number;
  cursorSize?: number;
};

type RoiComponentProps =
  | {
      children?: never;
      image: Image;
      options?: RoiComponentOptions;
    }
  | {
      children: JSX.Element;
      image?: never;
      options?: never;
    };

export function RoiComponent({
  children,
  image,
  options = {},
}: RoiComponentProps) {
  const { roiDispatch } = useContext(RoiDispatchContext);
  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted) {
          roiDispatch({ type: 'removeRoi' });
        }
      },
    },
  ]);

  return image ? (
    <ImageWrapper image={image} options={options} />
  ) : (
    <ElementWrapper>{children}</ElementWrapper>
  );
}
