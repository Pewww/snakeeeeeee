import BasePositionObject from './BasePositionObject';
import { ObjectPosition } from '../types/position';
import { getRandomNumber } from '../utils/random';

export default class Item extends BasePositionObject<ObjectPosition[]>{
  private count: number;
  private stageSize: number;
  private bombPosition: ObjectPosition[];

  constructor(count: number, stageSize: number, bombPosition: ObjectPosition[]) {
    super();

    this.count = count;
    this.stageSize = stageSize;
    this.bombPosition = bombPosition;

    this.render();
  }

  protected render() {
    const randomPosition = [];

    while (randomPosition.length < this.count) {
      const randomX = getRandomNumber(1, this.stageSize - 2);
      const randomY = getRandomNumber(1, this.stageSize - 2);

      const positionAlreadyExists = !!randomPosition.filter(({ x, y }) =>
        x === randomX && y === randomY
      ).length;

      const positionAlreadyExistsInBomb = !!this.bombPosition.filter(({ x, y }) =>
        x === randomX && y === randomY
      ).length;

      // Prevent Bombs from completely blocking the way to the Item.
      // @Warning: It is not a complete solution... :(
      const isBlockedEverywhere = this.bombPosition.filter(({ x, y }) =>
        (x === randomX && y === randomY - 1) // Top
        ||
        (x === randomX && y === randomY + 1) // Bottom
        ||
        (x === randomX - 1 && y === randomY) // Left
        ||
        (x === randomX + 1 && y === randomY) // Right
      ).length === 4;

      if (!positionAlreadyExists && !positionAlreadyExistsInBomb && !isBlockedEverywhere) {
        randomPosition.push({
          x: randomX,
          y: randomY
        });
      }
    }

    this.setPosition(randomPosition);
  }
}
