import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterModel from './models/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './models/points-model.js';
import NewPointButtonView from './view/new-point-button-view.js';

const headerElement = document.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const newPointElement = document.querySelector('.trip-main');

const filterModel = new FilterModel();
const pointsModel = new PointsModel();
const filterPresenter = new FilterPresenter({
  filterContainer: headerElement,
  filterModel,
  pointsModel
});
const boardPresenter = new BoardPresenter({
  boardContainer: eventsElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
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

const renderFilters = () => {
  filterPresenter.init();
};

boardPresenter.init(renderFilters);

render(newPointButtonComponent, newPointElement);
