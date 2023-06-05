import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import {render, RenderPosition} from '../framework/render.js';
import PointsModel from '../models/points-model.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {sortPointUp, sortPrice} from '../utils/point.js';
import {SortType} from '../const.js';
export default class BoardPresenter {
  #pointsModel = new PointsModel();
  #pointsData = [];
  #offersData = null;
  #destinationsData = null;
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.TIME;
  #sourcedBoardPoints = [];
  #boardPoints = [];
  #pointListComponent = new PointListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  async init(renderFilters) {
    await this.#pointsModel.getRoutePoints();
    await this.#pointsModel.getOffers();
    await this.#pointsModel.getDestinations();

    this.#pointsData = this.#pointsModel.points;
    this.#offersData = this.#pointsModel.offers;
    this.#destinationsData = this.#pointsModel.destinations;

    // render(new SortView(), this.boardContainer);
    render(this.#pointListComponent, this.boardContainer);
    renderFilters(this.#pointsData);
    //render(new PointEditView(this.#pointsData[2], this.#destinationsData, this.#offersData), this.pointListComponent.element);

    this.#pointsData.forEach((point) => {
      this.#renderPoint(point);
    });

    this.#boardPoints = [...this.#pointsModel.points];
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, this.#destinationsData, this.#offersData);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#boardPoints
      .forEach((point) => this.#renderPoint(point));
  }
  /*
  #renderNoPoints() {
    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }*/

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinationsData, this.#offersData);

  };

  #sortPoints(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardPoints
    switch (sortType) {

      case SortType.TIME:
        this.#boardPoints.sort(sortPointUp);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPrice);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardPoints исходный массив
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#renderPointList();

    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
  };

  #renderSort() {
    if (this.#sortComponent) {
      this.#sortComponent.removeElement();
    }
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.boardContainer, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPointList() {
    this.#clearPointList();
    render(this.#pointListComponent, this.boardContainer);
    this.#renderPoints();
  }

  #renderBoard() {

    /*if (this.#boardPoints.every((point) => point.isArchive)) {
      this.#renderNoPoints();
      return;
    }*/
    this.#renderSort();
    this.#renderPointList();
  }
}
