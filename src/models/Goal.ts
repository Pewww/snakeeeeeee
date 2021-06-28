import BasePositionObject from './BasePositionObject';
import type { SnakeStartPosition } from './Snake';
import { ObjectPosition } from '../types/position';

export default class Goal extends BasePositionObject<ObjectPosition> {
  private stageSize: number;
  private snakeStartPosition: SnakeStartPosition;

  constructor(stageSize: number, snakeStartPosition: SnakeStartPosition) {
    super();

    this.stageSize = stageSize;
    this.snakeStartPosition = snakeStartPosition;

    this.render();
  }

  protected render() {
    switch(this.snakeStartPosition) {
      case 'top-left': {
        this.setPosition({
          x: this.stageSize - 1,
          y: this.stageSize - 1
        });

        break;
      }
      case 'top-right': {
        this.setPosition({
          x: 0,
          y: this.stageSize - 1
        });

        break;
      }
      case 'bottom-left': {
        this.setPosition({
          x: this.stageSize - 1,
          y: 0
        });

        break;
      }
      case 'bottom-right': {
        this.setPosition({
          x: 0,
          y: 0
        });

        break;
      }
      default:
        break;
    }
  }
}
