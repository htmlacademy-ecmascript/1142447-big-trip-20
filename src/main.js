import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';


import {generateFilter} from './mock/filter.js';
const headerElement = document.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: eventsElement});
//render(new FilterView(), headerElement);
boardPresenter.init();




const filters = generateFilter(pointsModel.points);

render(new FilterView({filters}), siteMainElement);
