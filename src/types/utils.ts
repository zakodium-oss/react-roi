export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PanZoom {
  scale: number;
  translation: [number, number];
}

export type RoiMode = 'select' | 'draw';
