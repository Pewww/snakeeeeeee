import * as queryString from 'query-string';

import Main from './models/Main';
import Game from './models/Game';
import { OBJECT_STATUS_BY_LEVEL, TITLE_FONT_SIZE_BY_LEVEL } from './constants/level';
import { $id } from './utils/dom';

const parsedQuery = queryString.parse(location.search);
const level = Number((parsedQuery as Record<string, unknown>).level ?? '1');

new Main(
  new Game(
    OBJECT_STATUS_BY_LEVEL[level].stageSize,
    OBJECT_STATUS_BY_LEVEL[level].blockSize,
    level
  )
).render();

const titleElement = $id('title');
const rootElement = $id('root');

titleElement.innerText = `LEVEL ${level}`;
titleElement.style.fontSize = `${TITLE_FONT_SIZE_BY_LEVEL[level]}px`;
titleElement.style.marginTop = `-${rootElement.clientHeight + 100}px`;
