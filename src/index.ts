import * as queryString from 'query-string';

import Main from './models/Main';
import Game from './models/Game';
import { OBJECT_STATUS_BY_LEVEL } from './constants/level';

const parsedQuery = queryString.parse(location.search);
const level = Number((parsedQuery as any).level ?? '1');

new Main(
  new Game(
    OBJECT_STATUS_BY_LEVEL[level].stageSize,
    OBJECT_STATUS_BY_LEVEL[level].blockSize,
    level
  )
).render();
