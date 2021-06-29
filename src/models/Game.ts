import BaseObject from './BaseObject';
import Snake from './Snake';
import Bomb from './Bomb';
import Goal from './Goal';
import Item from './Item';

import { $create, $id } from '../utils/dom';
import { getRandomNumber } from '../utils/random';
import { ROTATE_DEGREE } from '../constants/rotate';
import { OBJECT_STATUS_BY_LEVEL } from '../constants/level';

type StageBaseFrame = 'block'
  | 'snake-body'
  | 'snake-head'
  | 'bomb'
  | 'item'
  | 'goal';

type GameStatus = 'start' | 'success' | 'over';

export default class Game extends BaseObject {
  private stageSize: number;
  private blockSize: number;
  private frame: StageBaseFrame[][] = [];
  private _status: GameStatus;
  private rotateDegree: number;
  private level: number;
  
  private snake: Snake;
  private bomb: Bomb;
  private goal: Goal;
  private item: Item;

  constructor(stageSize: number, blockSize: number, level: number) {
    super();

    this.stageSize = stageSize;
    this.blockSize = blockSize;
    this._status = null;
    this.rotateDegree = 0;
    this.level = level;

    this.snake = new Snake(OBJECT_STATUS_BY_LEVEL[level].snakeSize, stageSize, 'bottom-left');
    this.item = new Item(OBJECT_STATUS_BY_LEVEL[level].itemsCount, stageSize);
    this.bomb = new Bomb(OBJECT_STATUS_BY_LEVEL[level].bombsCount, stageSize, this.item.position);
    this.goal = new Goal(stageSize, 'bottom-left');

    this.setKeyDownEventHandler();
  }

  public start() {
    this.render();
  }

  public get status() {
    return this._status;
  }

  protected render() {
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
      this.frame = [...new Array(this.stageSize).fill('block')]
        .map(() => [...new Array(this.stageSize)].fill('block'));
    } else {
      this.frame.forEach((row, rowIdx) => {
        row.forEach((_, cellIdx) => {
          this.frame[rowIdx][cellIdx] = 'block';
        });
      })
    }

    // Set Snake Position
    const snakeHeadIdx = this.snake.position.length - 1;

    this.snake.position.forEach(({ x, y }, idx) => {
      this.frame[y][x] = idx === snakeHeadIdx
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

  private setKeyDownEventHandler() {
    document.body.addEventListener('keydown', this.handleKeyDownEvent.bind(this));
  }

  private handleKeyDownEvent(e: KeyboardEvent) {
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
        !(x === snakeCollisionInfo.position.x && y === snakeCollisionInfo.position.y)
      );
      const currRotateDegree = this.rotateDegree;
      let randomRotateDegree = ROTATE_DEGREE[
        getRandomNumber(0, ROTATE_DEGREE.length)
      ];

      // Prevent the same rotate from being set
      while (currRotateDegree === randomRotateDegree) {
        randomRotateDegree = ROTATE_DEGREE[
          getRandomNumber(0, ROTATE_DEGREE.length)
        ];
      }

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

    if (this._status !== null) {
      this.showResultByStatus();
    }
  }

  private showResultByStatus() {
    switch(this._status) {
      case 'success': {
        const MAX_LEVEL = 5;

        if (this.level < MAX_LEVEL) {
          const isConfirmed = confirm(`Level ${this.level} passed!\nGo to next level.`);

          if (isConfirmed) {
            location.href = `${location.pathname}?level=${this.level + 1}`;
          } else {
            location.reload();
          }
        } else {
          alert('You passed all levels! Congratulations :D');
          location.href = location.pathname;
        }

        break;
      }
      case 'over': {
        alert(`Level ${this.level} failed!`);
        location.reload();

        break;
      }
    }
  }
}
