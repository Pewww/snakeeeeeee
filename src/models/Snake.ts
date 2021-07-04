import range from 'lodash.range';

import type { StageBaseFrame } from '../Game';
import BasePositionObject from './BasePositionObject';
import { ObjectPosition } from '../types/position';
import { AVAILABLE_KEY } from '../constants/key';

export type SnakeStartPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type SnakeCollisionTarget = 'bomb' | 'item' | 'goal';

type SnakeCollisionInfo = {
  target: SnakeCollisionTarget;
  position: ObjectPosition;
};

export default class Snake extends BasePositionObject<ObjectPosition[]> {
  private size: number;
  private stageSize: number;
  private startPosition: SnakeStartPosition;
  private _collisionInfo: SnakeCollisionInfo;

  constructor(size: number, stageSize: number, startPosition: SnakeStartPosition) {
    super();

    this.size = size;
    this.stageSize = stageSize;
    this.startPosition = startPosition;
    this._collisionInfo = {
      target: null,
      position: null
    };

    this.render();
  }

  public get collisionInfo() {
    return this._collisionInfo;
  }

  public setCollisionInfo(collisionInfo: SnakeCollisionInfo) {
    this._collisionInfo = collisionInfo;
  }

  public moveSnake(e: KeyboardEvent, stageFrame?: StageBaseFrame[][]) {
    if (!(e.key in AVAILABLE_KEY)) {
      return;
    }

    const currPosition = this.position;

    const newPosition = [...currPosition];
    const positionLastIdx = currPosition.length - 1;
    const headOfCurrPosition = currPosition[positionLastIdx];

    switch(e.key) {
      case 'ArrowUp': {
        if (this.isYPositionOutOfMap(headOfCurrPosition.y - 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: headOfCurrPosition.x,
          y: headOfCurrPosition.y - 1
        };

        break;
      }
      case 'ArrowLeft': {
        if (this.isXPositionOutOfMap(headOfCurrPosition.x - 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: headOfCurrPosition.x - 1,
          y: headOfCurrPosition.y
        };

        break;
      }
      case 'ArrowRight': {
        if (this.isXPositionOutOfMap(headOfCurrPosition.x + 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: headOfCurrPosition.x + 1,
          y: headOfCurrPosition.y
        };

        break;
      }
      case 'ArrowDown': {
        if (this.isYPositionOutOfMap(headOfCurrPosition.y + 1)) {
          return;
        }

        newPosition[positionLastIdx] = {
          x: headOfCurrPosition.x,
          y: headOfCurrPosition.y + 1
        };

        break;
      }
    }

    const currPositionBodyStarts = currPosition.length - 2;

    for (let idx = currPositionBodyStarts; idx >= 0; idx--) {
      newPosition[idx] = {
        x: currPosition[idx + 1].x,
        y: currPosition[idx + 1].y
      }
    }

    const headOfNewPosition = newPosition[positionLastIdx];

    // Detect collision before setting new position
    this.detectCollision(stageFrame, headOfNewPosition);

    this.setPosition(newPosition);
  }

  protected render() {
    this.setInitialPosition();
  }

  private detectCollision(stageFrame: StageBaseFrame[][], headOfNewPosition: ObjectPosition) {
    const {
      x: headXPosition,
      y: headYPosition
    } = headOfNewPosition;

    const frameType = stageFrame[headYPosition][headXPosition] as SnakeCollisionTarget;
    const isCollided = ['bomb', 'item', 'goal'].includes(frameType);

    if (isCollided) {
      this.setCollisionInfo({
        target: frameType,
        position: {
          x: headXPosition,
          y: headYPosition
        }
      });
    }
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
}
