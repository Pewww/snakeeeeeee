import type { SnakeStartPosition } from './Snake';
import { ObjectPosition } from '../types/position';
import { getRandomNumber } from '../utils/random';

export default class Bomb {
  private stageSize: number;
  private snakeStartPosition: SnakeStartPosition;
  private _position: ObjectPosition[];
  private itemPosition: ObjectPosition[];
  private bombsPerXPosition: number;

  constructor(
    stageSize: number,
    snakeStartPosition: SnakeStartPosition,
    itemPosition: ObjectPosition[]
  ) {
    this.stageSize = stageSize;
    this.snakeStartPosition = snakeStartPosition;
    this.itemPosition = itemPosition;
    this.bombsPerXPosition = 4;

    this.render();
  }

  public get position() {
    return this._position;
  }

  private render() {
    const randomPosition = [];
    let innerRandomPosition = [];

    for (let y = 1; y < this.stageSize - 2; y++) {
      while (innerRandomPosition.length < this.bombsPerXPosition) {
        const randomX = getRandomNumber(1, this.stageSize - 2);
        const randomY = getRandomNumber(1, this.stageSize - 2);
  
        const positionAlreadyExists = !!this.itemPosition.filter(({ x, y }) =>
          x === randomX && y === randomY
          ||
          // Prevent Bombs from completely blocking the way to the Item.
          (x + 1 === randomX || x - 1 === randomX)
          ||
          (y + 1 === randomY || y - 1 === randomY)
        ).length;

        if (!positionAlreadyExists) {
          innerRandomPosition.push({
            x: randomX,
            y: randomY
          });
        }
      }

      randomPosition.push(...innerRandomPosition);
      innerRandomPosition = [];
    }

    this.setPosition(randomPosition);
  }

  private setPosition(position: ObjectPosition[]) {
    this._position = position;
  }
}
