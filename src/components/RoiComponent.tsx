import { Image } from 'image-js';
import { useContext } from 'react';
import { useKbsGlobal } from 'react-kbs';

import { RoiContext, RoiDispatchContext } from '../context/RoiContext';

import './css/RoiComponent.css';
import { ElementComponent } from './ElementComponent';
import { ImageComponent } from './ImageComponent';

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
  const { roiState } = useContext(RoiContext);
  useKbsGlobal([
    {
      shortcut: ['delete', 'backspace'],
      handler: (event) => {
        if (event.isTrusted && roiState.roiID) {
          roiDispatch({
            type: 'removeRoi',
            payload: roiState.roiID,
          });
        }
      },
    },
  ]);

  return image ? (
    <ImageComponent image={image} options={options} />
  ) : (
    <ElementComponent>{children}</ElementComponent>
  );
}
