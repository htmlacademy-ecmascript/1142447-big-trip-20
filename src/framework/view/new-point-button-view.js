import AbstractView from '../framework/view/abstract-view.js';
function createNewPointButtonTemplate() {
  return '<button class="control__button">+ ADD NEW POINT</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
