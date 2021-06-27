import Snake from './Snake';
import Bomb from './Bomb';
import Goal from './Goal';

import { $create, $id } from '../utils/dom';

type StageBaseFrame = 'block'
  | 'snake-body'
  | 'snake-head'
  | 'bomb'
  | 'goal';

export default class Stage {
  private stageSize: number;
  private blockSize: number;
  private frame: StageBaseFrame[][] = [];
  
  private snake: Snake;
  private bomb: Bomb;
  private goal: Goal;

  constructor(stageSize: number, blockSize: number) {
    this.stageSize = stageSize;
    this.blockSize = blockSize;

    this.snake = new Snake(10, stageSize, 'bottom-left');
    this.bomb = new Bomb(stageSize, 'bottom-left');
    this.goal = new Goal(stageSize, 'bottom-left');

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
  
      this.frame.forEach(rows => {
        const rowElement = $create('li');
  
        rows.forEach((cell) => {
          const cellElement = $create('div');
  
          cellElement.style.width = `${this.blockSize}px`;
          cellElement.style.height = `${this.blockSize}px`;
  
          if (cell !== 'block') {
            cellElement.className = cell;
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
          this.frame[rowIdx][cellIdx] = 'block';
        });
      })
    }

    const snakeLastPosition = this.snake.position.length - 1;

    // Set Snake Position
    this.snake.position.forEach(({ x, y }, idx) => {
      this.frame[y][x] = idx === snakeLastPosition
        ? 'snake-head'
        : 'snake-body';
    });

    // Set Bomb Position
    this.bomb.position.forEach(({ x, y }) => {
      this.frame[y][x] = 'bomb';
    });

    // Set Goal Position
    const goalPosition = this.goal.position;

    this.frame[goalPosition.y][goalPosition.x] = 'goal';
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
