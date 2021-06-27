import { ObjectPosition } from '../types/position';
import { getRandomNumber } from '../utils/random';

export default class Item {
  private count: number;
  private stageSize: number;
  private _position: ObjectPosition[];

  constructor(count: number, stageSize: number) {
    this.count = count;
    this.stageSize = stageSize;

    this.render();
  }

  public get position() {
    return this._position;
  }

  private render() {
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

  public setPosition(position: ObjectPosition[]) {
    this._position = position;
  }
}
