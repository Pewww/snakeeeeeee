import Snake from './Snake';
import Bomb from './Bomb';
import Goal from './Goal';
import Item from './Item';

import { $create, $id } from '../utils/dom';
import { getRandomNumber } from '../utils/random';
import { ROTATE_DEGREE } from '../constants/rotate';

type StageBaseFrame = 'block'
  | 'snake-body'
  | 'snake-head'
  | 'bomb'
  | 'item'
  | 'goal';

type GameStatus = 'start' | 'success' | 'over';

export default class Game {
  private stageSize: number;
  private blockSize: number;
  private frame: StageBaseFrame[][] = [];
  private _status: GameStatus;
  private rotateDegree: number;
  
  private snake: Snake;
  private bomb: Bomb;
  private goal: Goal;
  private item: Item;

  constructor(stageSize: number, blockSize: number) {
    this.stageSize = stageSize;
    this.blockSize = blockSize;
    this._status = null;
    this.rotateDegree = 0;

    this.snake = new Snake(10, stageSize, 'bottom-left');
    this.bomb = new Bomb(stageSize, 'bottom-left');
    this.goal = new Goal(stageSize, 'bottom-left');
    this.item = new Item(5, stageSize);

    this.setKeyupEventHandler();
  }

  public get status() {
    return this._status;
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

      rootElement.style.transform = `rotate(${this.rotateDegree}deg)`;
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

    // Set Item Position
    this.item.position.forEach(({ x, y }) => {
      this.frame[y][x] = 'item';
    });

    // Set Bomb Position
    this.bomb.position.forEach(({ x, y }) => {
      this.frame[y][x] = 'bomb';
    });

    // Set Goal Position
    const goalPosition = this.goal.position;

    this.frame[goalPosition.y][goalPosition.x] = 'goal';
  }

  private setStatus(status: GameStatus) {
    this._status = status;
  }

  private setRotateDegree(rotateDegree: number) {
    this.rotateDegree = rotateDegree;
  }

  private setKeyupEventHandler() {
    document.body.addEventListener('keyup', e => {
      this.snake.moveSnake(
        e,
        this.bomb.position,
        this.goal.position,
        this.item.position
      );

      // Set Game Status
      const snakeCollisionInfo = this.snake.collisionInfo;

      if (snakeCollisionInfo.target === 'Item') {
        const filteredItemPosition = this.item.position.filter(({ x, y }) =>
          x !== snakeCollisionInfo.position.x && y !== snakeCollisionInfo.position.y
        );
        const randomRotateDegree = ROTATE_DEGREE[
          getRandomNumber(0, ROTATE_DEGREE.length - 1)
        ];

        this.item.setPosition(filteredItemPosition);
        this.setRotateDegree(randomRotateDegree);
      } else if (snakeCollisionInfo.target === 'Bomb') {
        this.setStatus('over');
      } else if (snakeCollisionInfo.target === 'Goal') {
        const isAllItemsEatenBySnake = !this.item.position.length;

        this.setStatus(isAllItemsEatenBySnake
          ? 'success'
          : 'over'
        );
      }

      this.render();
      this.snake.setCollisionInfo({
        target: null,
        position: null
      });
    });
  }
}
