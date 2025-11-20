import { getRectanglePoints } from '../utilities/box.js';

import type { Roi } from './Roi.js';
import type { CommittedBox } from './box.js';

export type CommittedRoiProperties<TData = unknown> = Omit<
  Roi<TData>,
  'action' | 'box'
> &
  CommittedBox;

export class CommittedRoi<TData = unknown>
  implements CommittedRoiProperties<TData>
{
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public angle: number;
  public data?: TData;
  constructor(properties: CommittedRoiProperties<TData>) {
    this.id = properties.id;
    this.x = properties.x;
    this.y = properties.y;
    this.width = properties.width;
    this.height = properties.height;
    this.angle = properties.angle;
    this.data = properties.data;
  }

  /**
   * Get the four corner points of the rectangle representing this ROI.
   * The unrotated rectangle is used to determine the order of the points:
   * top-left, top-right, bottom-right, bottom-left.
   * @return The four corner points of the rectangle.
   */
  public getRectanglePoints() {
    return getRectanglePoints(this);
  }
}
