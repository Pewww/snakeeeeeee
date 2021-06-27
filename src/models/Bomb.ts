import type { SnakeStartPosition } from './Snake';
import { ObjectPosition } from '../types/position';
import { getRandomNumber } from '../utils/random';

export default class Bomb {
  private stageSize: number;
  private _position: ObjectPosition[];
  private itemPosition: ObjectPosition[];
  private count: number;

  constructor(count: number, stageSize: number, itemPosition: ObjectPosition[]) {
    this.stageSize = stageSize;
    this.itemPosition = itemPosition;
    this.count = count;

    this.render();
  }

  public get position() {
    return this._position;
  }

  private render() {
    const randomPosition = [];
    let innerRandomPosition = [];

    for (let y = 1; y < this.stageSize - 1; y++) {
      while (innerRandomPosition.length < this.count) {
        const randomX = getRandomNumber(1, this.stageSize - 2);
        // @TODO: Prevent Bombs from completely blocking the way to the Item.
  
        const positionAlreadyExistsInItem = !!this.itemPosition.filter(({ x: itemX, y: itemY }) =>
          itemX === randomX && itemY === y
        ).length;

        const positionAlreadyExistsInInnerArr = !!innerRandomPosition.filter(({ x: innerX, y: innerY }) =>
          innerX === randomX && innerY === y
        ).length;


        if (!positionAlreadyExistsInItem && !positionAlreadyExistsInInnerArr) {
          innerRandomPosition.push({
            x: randomX,
            y
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
