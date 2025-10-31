import { getRectanglePoints } from '../utilities/box.js';
import type { Point } from '../utilities/point.js';

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
  public getRectanglePoints(): Point[] {
    return getRectanglePoints(this);
  }
}
