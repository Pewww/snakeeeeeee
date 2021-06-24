import range from 'lodash.range';

type SnakeStartPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type SnakePosition = {
  x: number;
  y: number;
};

export default class Snake {
  private size: number;
  private stageSize: number;
  private startPosition: SnakeStartPosition;
  private _position: SnakePosition[];

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
    // @TODO: 스테이지 밖으로 벗어날 때에 대한 예외 처리
    const positionLastIdx = this.position.length - 1;
    const positionLastElement = this.position[positionLastIdx];

    const ConvertEventKeyToHeadPosition = {
      ArrowUp: {
        x: positionLastElement.x,
        y: positionLastElement.y - 1
      },
      ArrowLeft: {
        x: positionLastElement.x - 1,
        y: positionLastElement.y
      },
      ArrowRight: {
        x: positionLastElement.x + 1,
        y: positionLastElement.y
      },
      ArrowDown: {
        x: positionLastElement.x,
        y: positionLastElement.y + 1
      }
    };

    if (!ConvertEventKeyToHeadPosition[e.key]) {
      return;
    }

    const newPosition = [...this.position];

    newPosition[positionLastIdx] = ConvertEventKeyToHeadPosition[e.key];

    for (let idx = this.position.length - 2; idx >= 0; idx--) {
      newPosition[idx] = {
        x: this.position[idx + 1].x,
        y: this.position[idx + 1].y
      };
    }

    this.setPosition(newPosition);
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

  private setPosition(position: SnakePosition[]) {
    this._position = position;
  }
}
