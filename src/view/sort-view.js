import AbstractView from '../framework/view/abstract-view.js';


function createSortTemplate() {
//function createSortTemplate(currentSortType) {
  return (
  //<div class="board__sort-list"></div>

    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input data-sort-type="time" id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input data-sort-type="price" id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`

  /* <a href="#" class="board__sort-item ${currentSortType === SortType.DEFAULT ? 'board__sort-item--active' : ''}" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__sort-item ${currentSortType === SortType.DATE_UP ? 'board__sort-item--active' : ''}" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__sort-item ${currentSortType === SortType.DATE_DOWN ? 'board__sort-item--active' : ''}" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
   */
  );
}
export default class SortView extends AbstractView {

  #handleSortTypeChange = null;

  //constructor({onSortTypeChange}) {

  constructor({currentSortType, onSortTypeChange}) {
    super();

    this.#currentSortType = currentSortType;

    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    //return createSortTemplate();

    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}

