import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import {generateFilter} from './mock/filter.js';

const headerElement = document.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: eventsElement});
//render(new FilterView(), headerElement);

const renderFilters = (points) => {
  const filters = generateFilter(points);
  render(new FilterView({filters}), headerElement);
};

boardPresenter.init(renderFilters);
