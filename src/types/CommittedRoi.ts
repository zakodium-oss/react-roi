import { getRectanglePoints } from '../utilities/box';
import { Point } from '../utilities/point';

import { Roi } from './Roi';
import { CommittedBox } from './box';

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
