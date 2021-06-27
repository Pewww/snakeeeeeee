import { ObjectPosition } from '../types/position';
import type { SnakeStartPosition } from './Snake';

export default class Goal {
  private stageSize: number;
  private snakeStartPosition: SnakeStartPosition;
  private _position: ObjectPosition;

  constructor(stageSize: number, snakeStartPosition: SnakeStartPosition) {
    this.stageSize = stageSize;
    this.snakeStartPosition = snakeStartPosition;

    this.render();
  }

  public get position() {
    return this._position;
  }

  private render() {
    switch(this.snakeStartPosition) {
      case 'top-left': {
        this._position = {
          x: this.stageSize - 1,
          y: this.stageSize - 1
        };

        break;
      }
      case 'top-right': {
        this._position = {
          x: 0,
          y: this.stageSize - 1
        };

        break;
      }
      case 'bottom-left': {
        this._position = {
          x: this.stageSize - 1,
          y: 0
        };

        break;
      }
      case 'bottom-right': {
        this._position = {
          x: 0,
          y: 0
        };

        break;
      }
      default:
        break;
    }
  }
}
