import BaseObject from './BaseObject';
import { ObjectPosition } from '../types/position';

export default abstract class PositionObject<
  T extends (ObjectPosition | ObjectPosition[])
> extends BaseObject {
  private _position: T;

  public get position() {
    return this._position;
  }

  public setPosition(position: T) {
    this._position = position;
  }
}
