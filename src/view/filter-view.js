import AbstractView from '../framework/view/abstract-view.js';

//function createFilterTemplate() {
//function createFilterItemTemplate(filter, isChecked) {

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, count} = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'cheched' : ''} ${count === 0 ? 'disabled' : ''} >
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`
  );
}

function createFilterTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
  //.map((filter, index) => createFilterItemTemplate(filter, index === 0))

    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');


  return (
    `<div class="trip-main__trip-controls  trip-controls">
    <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">

      ${filterItemsTemplate}

        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>
  </div>`
  );
}

//export default class FilterView extends AbstractView {

constructor({filters, currentFilterType, onFilterTypeChange}) {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;

    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    //return createFilterTemplate(this.#filters);

    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
  };
}

/*export default class FilterView extends AbstractView {
  get template() {
    return createFilterTemplate();
  }
}
*/
