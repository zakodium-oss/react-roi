export interface Point {
  x: number;
  y: number;
}

export interface CommittedBox {
  /**
   * x position of the top left corner of the un-rotated box
   */
  x: number;
  /**
   * y position of the top left corner of the un-rotated box
   */
  y: number;
  /**
   * Height of the box
   */
  height: number;
  /**
   * Width of the box
   */
  width: number;
  /**
   * Rotation angle of the box
   * The rotation has the top left corner as the origin
   */
  angle: number;
}

export interface Box {
  /**
   * Left position of the ROI box in absolute units (px).
   */
  x1: number;
  /**
   * Top position of the ROI box in absolute units (px).
   */
  y1: number;
  /**
   * Width of the ROI box in absolute units (px).
   */
  x2: number;
  /**
   * Height of the ROI box in absolute units (px).
   */
  y2: number;
  /**
   * Rotation angle around the center of the ROI in radians
   */
  angle: number;
}

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

export type RoiMode = 'select' | 'draw' | 'hybrid';

export type ResizeStrategy = 'cover' | 'contain' | 'center' | 'none';
