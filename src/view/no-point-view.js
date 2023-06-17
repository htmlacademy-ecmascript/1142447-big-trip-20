import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.ALL]: 'Click «ADD NEW POINT» in menu to create your first point',
  [FilterType.OVERDUE]: 'There are no overdue points now',
  [FilterType.TODAY]: 'There are no points today',
  [FilterType.FAVORITES]: 'There are no favorite points now',
  [FilterType.REPEATING]: 'There are no repeating points now',
};

function createNoPointTemplate(filterType) {
  const noPointTextValue = NoPointsTextType[filterType];

  return (
    `<p class="board__no-points">
    ${noPointTextValue}
    </p>`
  );
}
export default class NoPointkView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
