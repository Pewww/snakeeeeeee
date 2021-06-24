import Stage from "./Stage";

export default class Main {
  private stage: Stage;

  constructor(stage: Stage) {
    this.stage = stage;
  }

  public render() {
    this.stage.render();
  }
}
