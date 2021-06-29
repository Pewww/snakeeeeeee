import { $id } from '../utils/dom';

export default class Popup {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  public open() {
    const popup = $id(this.id);
        
    if (popup) {
      popup.style.display = 'block';
    }
  }

  public close() {
    const popup = $id(this.id);

    if (popup) {
      popup.style.display = 'none';
    }
  }
}
