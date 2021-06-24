import Snake from './Snake';

import { $create, $id } from '../utils/dom';

type StageBaseFrame = 0 | 1 | 2;

export default class Stage {
  private stageSize: number;
  private blockSize: number;
  private frame: StageBaseFrame[][] = [];
  
  private snake: Snake;

  constructor(stageSize: number, blockSize: number) {
    this.stageSize = stageSize;
    this.blockSize = blockSize;

    this.snake = new Snake(10, stageSize, 'bottom-left');

    this.setKeyupEventHandler();
  }

  public render() {
    this.buildFrame();
    this.renderStage();
  }

  private renderStage() {
    const rootElement = $id('root');

    if (rootElement !== null) {
      rootElement.remove();
      this.renderStage();
    } else {
      const rootElement = $create('ul');
      rootElement.id = 'root';
  
      this.frame.forEach((row) => {
        const rowElement = $create('li');
  
        row.forEach((cell) => {
          const cellElement = $create('div');
  
          cellElement.style.width = `${this.blockSize}px`;
          cellElement.style.height = `${this.blockSize}px`;
  
          if (cell === 1) {
            cellElement.className = 'snake-body';
          } else if (cell === 2) {
            cellElement.className = 'snake-head';
          }
  
          rowElement.appendChild(cellElement);
        });
  
        rootElement.appendChild(rowElement);
      });
  
      document.body.appendChild(rootElement); 
    }
  }

  private buildFrame() {
    const isFrameEmpty = this.frame.length === 0;

    if (isFrameEmpty) {
      this.frame = [...new Array(this.stageSize).fill(0)]
        .map(() => [...new Array(this.stageSize)].fill(0));
    } else {
      this.frame.forEach((row, rowIdx) => {
        row.forEach((_, cellIdx) => {
          this.frame[rowIdx][cellIdx] = 0;
        });
      })
    }

    const snakeLastPosition = this.snake.position.length - 1;

    this.snake.position.forEach(({ x, y }, idx) => {
      this.frame[y][x] = idx === snakeLastPosition
        ? 2
        : 1;
    });
  }

  private setKeyupEventHandler() {
    // @TODO: 키를 꾹 눌렀을 때에 대한 이동 처리 필요
    document.body.addEventListener('keyup', e => {
      this.snake.moveSnake(e);
      this.render();
    });
  }

  private unsetKeyupEventHandler() {
    document.body.removeEventListener('keyup', this.snake.moveSnake);
  }
}
