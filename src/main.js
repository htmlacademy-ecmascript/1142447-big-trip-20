import FilterView from './view/filter-view.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const headerElement = document.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: eventsElement});
render(new FilterView(), headerElement);
boardPresenter.init();
