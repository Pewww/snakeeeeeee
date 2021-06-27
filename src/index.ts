import Main from './models/Main';
import Game from './models/Game';

new Main(
  new Game(40, 16)
).render();
