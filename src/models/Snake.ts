import range from 'lodash.range';

import { ObjectPosition } from '../types/position';
import { AVAILABLE_KEY } from '../constants/key';

type SnakeStartPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default class Snake {
  private size: number;
  private stageSize: number;
  private startPosition: SnakeStartPosition;
  private _position: ObjectPosition[];

  constructor(size: number, stageSize: number, startPosition: SnakeStartPosition) {
    this.size = size;
    this.stageSize = stageSize;
    this.startPosition = startPosition;

    this.setInitialPosition();
  }

  public get position() {
    return this._position;
  }

  public moveSnake(e: KeyboardEvent) {
    if (!(e.key in AVAILABLE_KEY)) {
      return;
    }

    const newPosition = [...this.position];
    const positionLastIdx = this.position.length - 1;
    const currPositionHead = this.position[positionLastIdx];

    switch(e.key) {
      case 'ArrowUp': {
        if (this.isYPositionOutOfMap(currPositionHead.y - 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: currPositionHead.x,
          y: currPositionHead.y - 1
        };

        break;
      }
      case 'ArrowLeft': {
        if (this.isXPositionOutOfMap(currPositionHead.x - 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: currPositionHead.x - 1,
          y: currPositionHead.y
        };

        break;
      }
      case 'ArrowRight': {
        if (this.isXPositionOutOfMap(currPositionHead.x + 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: currPositionHead.x + 1,
          y: currPositionHead.y
        };

        break;
      }
      case 'ArrowDown': {
        if (this.isYPositionOutOfMap(currPositionHead.y + 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: currPositionHead.x,
          y: currPositionHead.y + 1
        };

        break;
      }
    }

    const currPositionBodyStarts = this.position.length - 2;

    for (let idx = currPositionBodyStarts; idx >= 0; idx--) {
      newPosition[idx] = {
        x: this.position[idx + 1].x,
        y: this.position[idx + 1].y
      }
    }

    this.setPosition(newPosition);
  }

  private isXPositionOutOfMap(x: number) {
    return x < 0 || x >= this.stageSize; 
  }

  private isYPositionOutOfMap(y: number) {
    return y < 0 || y >= this.stageSize;
  }

  private setInitialPosition() {
    switch(this.startPosition) {
      case 'top-left': {
        const position = range(0, this.size)
          .map(x => ({
            x,
            y: 0
          }));

        this.setPosition(position);

        break;
      }
      case 'top-right': {
        const position = range(0, this.size)
          .map(y => ({
            x: this.stageSize - 1,
            y
          }));

        this.setPosition(position);

        break;
      }
      case 'bottom-left': {
        const position = range(this.stageSize - 1, this.stageSize - this.size - 1)
          .map(y => ({
            x: 0,
            y
          }));

        this.setPosition(position);

        break;
      }
      case 'bottom-right':
        const position = range(this.stageSize - 1, this.stageSize - this.size - 1)
          .map(x => ({
            x,
            y: this.stageSize - 1
          }));

        this.setPosition(position);

        break;
      default:
        break;
    }
  }

  private setPosition(position: ObjectPosition[]) {
    this._position = position;
  }
}
