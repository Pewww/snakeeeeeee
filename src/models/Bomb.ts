import BasePositionObject from './BasePositionObject';
import { ObjectPosition } from '../types/position';
import { getRandomNumber } from '../utils/random';

export default class Bomb extends BasePositionObject<ObjectPosition[]> {
  private stageSize: number;
  private count: number;

  constructor(count: number, stageSize: number) {
    super();

    this.stageSize = stageSize;
    this.count = count;

    this.render();
  }

  protected render() {
    const randomPosition = [];

    for (let y = 1; y < this.stageSize - 1; y++) {
      const innerRandomPosition = [];

      while (innerRandomPosition.length < this.count) {
        const randomX = getRandomNumber(1, this.stageSize - 2);

        const positionAlreadyExistsInInnerArr = !!innerRandomPosition.filter(({ x: innerX, y: innerY }) =>
          innerX === randomX && innerY === y
        ).length;


        if (!positionAlreadyExistsInInnerArr) {
          innerRandomPosition.push({
            x: randomX,
            y
          });
        }
      }

      randomPosition.push(...innerRandomPosition);
    }

    this.setPosition(randomPosition);
  }
}
