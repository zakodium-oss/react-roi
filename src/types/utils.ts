export interface Point {
  x: number;
  y: number;
}

export interface CommittedBox {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Size {
  width: number;
  height: number;
}

export type RoiAction = 'idle' | 'moving' | 'drawing' | 'panning' | 'resizing';

export interface PanZoom {
  scale: number;
  translation: [number, number];
}

export type RoiMode = 'select' | 'draw';

export type ResizeStrategy = 'cover' | 'contain' | 'center' | 'none';
