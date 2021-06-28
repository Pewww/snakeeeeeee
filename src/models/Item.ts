import BasePositionObject from './BasePositionObject';
import { ObjectPosition } from '../types/position';
import { getRandomNumber } from '../utils/random';

export default class Item extends BasePositionObject<ObjectPosition[]>{
  private count: number;
  private stageSize: number;

  constructor(count: number, stageSize: number) {
    super();

    this.count = count;
    this.stageSize = stageSize;

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

      if (!positionAlreadyExists) {
        randomPosition.push({
          x: randomX,
          y: randomY
        });
      }
    }

    this.setPosition(randomPosition);
  }
}
