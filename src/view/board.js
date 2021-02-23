import {createElement} from "../utils.js";

export const createBoardTemplate = () => {
  return (
    `<section class="board container"></section>`
  );
};

export default class Board {
  constructor() {
    this._element = null;
  }

  get getTemplate() {
    return createBoardTemplate();
  }

  get getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

