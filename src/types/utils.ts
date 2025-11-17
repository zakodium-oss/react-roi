export interface Size {
  width: number;
  height: number;
}

export type ReactRoiAction =
  | 'idle'
  | 'moving'
  | 'rotating'
  | 'drawing'
  | 'panning'
  | 'resizing';

export interface PanZoom {
  scale: number;
  translation: [number, number];
}

export type RoiMode = 'select' | 'draw' | 'hybrid' | 'rotate_selected';

export type ResizeStrategy = 'cover' | 'contain' | 'center' | 'none';
