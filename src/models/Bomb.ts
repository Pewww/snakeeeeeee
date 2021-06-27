import { ObjectPosition } from '../types/position';
import type { SnakeStartPosition } from './Snake';

export default class Bomb {
  private stageSize: number;
  private snakeStartPosition: SnakeStartPosition;
  private _position: ObjectPosition[];

  constructor(stageSize: number, snakeStartPosition: SnakeStartPosition) {
    this.stageSize = stageSize;
    this.snakeStartPosition = snakeStartPosition;

    this.render();
  }

  public get position() {
    return this._position;
  }

  private render() {
    this.setPosition([
      {
        x: 20,
        y: 20
      }
    ]);
  }

  private setPosition(position: ObjectPosition[]) {
    this._position = position;
  }
}
