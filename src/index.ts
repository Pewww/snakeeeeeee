import * as queryString from 'query-string';

import Main from './models/Main';
import Game from './models/Game';
import Popup from './models/Popup';
import { OBJECT_STATUS_BY_LEVEL, TITLE_FONT_SIZE_BY_LEVEL } from './constants/level';
import { $id, $class } from './utils/dom';

const parsedQuery = queryString.parse(location.search);
const level = Number((parsedQuery as Record<string, unknown>).level);

if (level) {
  new Main(
    new Game(
      OBJECT_STATUS_BY_LEVEL[level].stageSize,
      OBJECT_STATUS_BY_LEVEL[level].blockSize,
      level
    )
  ).render();
  
  const levelTitleElement = $id('level-title');
  const rootElement = $id('root');
  
  levelTitleElement.innerText = `LEVEL ${level}`;
  levelTitleElement.style.fontSize = `${TITLE_FONT_SIZE_BY_LEVEL[level]}px`;
  levelTitleElement.style.marginTop = `-${rootElement.clientHeight + 100}px`;
} else {
  const gameConnectionCoverElement = $id('game-connection-cover');

  gameConnectionCoverElement.style.display = 'block';

  const gameStartBtnElement = $id('game-start-btn');
  const howToBtnElement = $id('how-to-btn');
  const popup = new Popup('how-to-popup-wrapper');

  const handleGameStartBtnClick = () => {
    location.href = `${location.pathname}?level=1`;
  };

  const handleHowToBtnClick = () => {
    const closeBtn = $class('close-btn');

    popup.open();

    closeBtn[0].addEventListener('click', () => {
      popup.close();
    });
  };

  gameStartBtnElement.addEventListener('click', handleGameStartBtnClick);
  howToBtnElement.addEventListener('click', handleHowToBtnClick);
}
