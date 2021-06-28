import range from 'lodash.range';

import BasePositionObject from './BasePositionObject';
import { ObjectPosition } from '../types/position';
import { AVAILABLE_KEY } from '../constants/key';

export type SnakeStartPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type SnakeCollisionInfo = {
  target: 'Bomb' | 'Item' | 'Goal';
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

  public moveSnake(
    e: KeyboardEvent,
    bombPosition: ObjectPosition[],
    goalPosition: ObjectPosition,
    itemPosition: ObjectPosition[]
  ) {
    if (!(e.key in AVAILABLE_KEY)) {
      return;
    }

    const currPosition = this.position;

    const newPosition = [...currPosition];
    const positionLastIdx = currPosition.length - 1;
    const currPositionHead = currPosition[positionLastIdx];

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

    const currPositionBodyStarts = currPosition.length - 2;

    for (let idx = currPositionBodyStarts; idx >= 0; idx--) {
      newPosition[idx] = {
        x: currPosition[idx + 1].x,
        y: currPosition[idx + 1].y
      }
    }

    this.setPosition(newPosition);

    // Detect collision after setting new position
    this.detectCollision(bombPosition, goalPosition, itemPosition);
  }

  protected render() {
    this.setInitialPosition();
  }

  private detectCollision(
    bombPosition: ObjectPosition[],
    goalPosition: ObjectPosition,
    itemPosition: ObjectPosition[]
  ) {
    const collisionInfoWithGoal = this.collisionInfoWithGoal(goalPosition);
    const collisionInfoWithItem = this.collisionInfoWithItem(itemPosition);
    const collisionInfoWithBomb = this.collisionInfoWithBomb(bombPosition);

    if (collisionInfoWithGoal.isCollided) {
      this.setCollisionInfo({
        target: 'Goal',
        position: collisionInfoWithGoal.position
      });
    } else if (collisionInfoWithItem.isCollided) {
      this.setCollisionInfo({
        target: 'Item',
        position: collisionInfoWithItem.position
      });
    } else if (collisionInfoWithBomb.isCollided) {
      this.setCollisionInfo({
        target: 'Bomb',
        position: collisionInfoWithBomb.position
      });
    }
  }

  private collisionInfoWithBomb(bombPosition: ObjectPosition[]) {
    const currPosition = this.position;
    const head = currPosition[currPosition.length - 1];
    const collidedBomb = bombPosition.filter(({ x, y }) =>
      x === head.x && y === head.y
    );

    return {
      isCollided: !!collidedBomb.length,
      position: collidedBomb[0]
    };
  }

  private collisionInfoWithGoal(goalPosition: ObjectPosition) {
    const currPosition = this.position;
    const head = currPosition[currPosition.length - 1];
    const isCollided = head.x === goalPosition.x
      && head.y === goalPosition.y;

    return {
      isCollided,
      position: goalPosition
    };
  }

  private collisionInfoWithItem(itemPosition: ObjectPosition[]) {
    const currPosition = this.position;
    const head = currPosition[currPosition.length - 1];
    const collidedItem = itemPosition.filter(({ x, y }) =>
      x === head.x && y === head.y
    );

    return {
      isCollided: !!collidedItem.length,
      position: collidedItem[0]
    };
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
