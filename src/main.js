//import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
//import {generateFilter} from './mock/filter.js';

import FilterPresenter from './presenter/filter-presenter.js';


/*const filters = [
  {
    type: 'all',
    count: 0,
  },
];*/

import FilterModel from './model/filter-model.js';

const headerElement = document.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({
  boardContainer: eventsElement,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose

});



//render(new FilterView(), headerElement);

const renderFilters = (points) => {
  const filters = generateFilter(points);
  //render(new FilterView({filters}), headerElement);
};

const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, siteHeaderElement);

/*render(new FilterView({
  filters,
  currentFilterType: 'all',
  onFilterTypeChange: () => {}
}), siteMainElement);*/

filterPresenter.init();

const filterModel = new FilterModel();

boardPresenter.init(renderFilters);
