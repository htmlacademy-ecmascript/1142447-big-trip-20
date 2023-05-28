import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointsModel from '../models/points-model.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {sortPointUp, sortPointDown} from '../utils/point.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #pointsModel = new PointsModel();
  #pointsData = null;
  #offersData = null;
  #destinationsData = null;
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardPoints = [];

  pointListComponent = new PointListView();


  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  async init(renderFilters) {
    this.#pointsData = await this.#pointsModel.getRoutePoints();
    this.#offersData = await this.#pointsModel.getOffers();
    this.#destinationsData = await this.#pointsModel.getDestinations();
    render(new SortView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    renderFilters(this.#pointsData);
    //render(new PointEditView(this.#pointsData[2], this.#destinationsData, this.#offersData), this.pointListComponent.element);

    this.#pointsData.forEach((point) => {
      this.#renderPoint(point);
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, this.#pointPresenter);
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
      onModeChange: this.#handleModeChang
    });

    pointPresenter.init(point);
  }

  #renderPoints(from, to) {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }
  #renderNoPoints() {
    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick
    });

    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);

  };
  #sortPoints(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardPoints
    switch (sortType) {
      case SortType.DATE_UP:
        this.#boardPoints.sort(sortPointUp);
        break;
      case SortType.DATE_DOWN:
        this.#boardPoints.sort(sortPointDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#renderedPointCount = POINT_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPointList() {
    render(this.#pointListComponent, this.#boardComponent.element);
    this.#renderPoints(0, Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP));
    if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }
  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    if (this.#boardPoints.every((point) => point.isArchive)) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
  }
}

    /* const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new PointView(
      point,
      this.#destinationsData.find((el) => el.id === point.destination),
      this.#offersData.find((el) => el.type === point.type),
      () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    );*/

    /*const pointEditComponent = new PointEditView(
      point,
      this.#destinationsData,
      this.#offersData,
      () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      () => {
        replaceFormToCard();
      }
    );

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.pointListComponent.element);
  }
};*/
