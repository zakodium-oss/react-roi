import { Point } from '../utilities/point';
import { rotatePoint } from '../utilities/rotate';

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
    const { x, y, width, height, angle } = this;
    const center: Point = { x, y };
    return [
      center,
      rotatePoint({ x: x + width, y }, center, angle),
      rotatePoint({ x: x + width, y: y + height }, center, angle),
      rotatePoint({ x, y: y + height }, center, angle),
    ];
  }
}
