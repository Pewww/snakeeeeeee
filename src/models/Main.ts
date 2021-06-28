import Game from './Game';

export default class Main {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public render() {
    this.game.start();
  }
}
