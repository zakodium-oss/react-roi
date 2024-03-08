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
