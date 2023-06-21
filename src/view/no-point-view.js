import AbstractView from '../framework/view/abstract-view.js';
import {FilterTypes} from '../const.js';

const NoPointsTextType = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now',
};

function createNoPointTemplate(filterType) {
  const noPointTextValue = NoPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">${noPointTextValue}</p>`
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
