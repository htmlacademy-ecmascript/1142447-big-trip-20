import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
//import {updateItem} from '../utils/common.js';
import {sortPointUp, sortPrice} from '../utils/point.js';
import {SortType, UpdateType, UserAction, FilterTypes} from '../const.js';
import { filter } from '../utils/filter.js';
import NoPointkView from '../view/no-point-view.js';
import NewPointPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #pointsModel = null;
  #pointsData = [];
  #offersData = null;
  #destinationsData = null;
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];
  #boardPoints = [];
  #pointListComponent = new PointListView();
  #filterType = FilterTypes.EVERYTHING;
  #filterModel = null;
  #noPointComponent = null;
  #newPointPresenter = null;
  #handleNewPointDestroy = null;

  constructor({boardContainer, filterModel, pointsModel, onNewPointDestroy}) {
    this.boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#handleNewPointDestroy = onNewPointDestroy;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    //this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        /*try {
          await this.#tasksModel.updateTask(updateType, update);
        } catch(err) {
          this.#taskPresenters.get(update.id).setAborting();
        }*/
        break;
      case UserAction.ADD_POINT:
        //this.#newTaskPresenter.setSaving();
        /* try {
          await this.#tasksModel.addTask(updateType, update);
        } catch(err) {
          this.#newTaskPresenter.setAborting();
        }*/
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        /* this.#taskPresenters.get(update.id).setDeleting();
        try {
          await this.#tasksModel.deleteTask(updateType, update);
        } catch(err) {
          this.#taskPresenters.get(update.id).setAborting();
        }*/
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

    // this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList();
        this.#renderBoard();
        break;
      /*case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;*/
    }
  };

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointUp);
      case SortType.DATE_DOWN:
        return filteredPoints.sort(sortPrice);
    }

    return filteredPoints;

  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init();
  }

  async init(renderFilters) {
    await this.#pointsModel.getRoutePoints();
    await this.#pointsModel.getOffers();
    await this.#pointsModel.getDestinations();

    this.#pointsData = this.#pointsModel.points;
    this.#offersData = this.#pointsModel.offers;
    this.#destinationsData = this.#pointsModel.destinations;
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy,
      destinations: this.#destinationsData,
      offers: this.#offersData
    });


    this.#renderSort();
    render(this.#pointListComponent, this.boardContainer);
    renderFilters();
    //render(new PointEditView(this.#pointsData[2], this.#destinationsData, this.#offersData), this.pointListComponent.element);

    this.points.forEach((point) => {
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
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, this.#destinationsData, this.#offersData);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.points
      .forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoint () {
    this.#noPointComponent = new NoPointkView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.boardContainer, RenderPosition.BEFOREEND);
  }

  /* #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinationsData, this.#offersData);

  };*/

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
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    render(this.#sortComponent, this.boardContainer, RenderPosition.AFTERBEGIN);
  }

  #clearPointList(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      this.#noPointComponent = null;
    }
    if(resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPointList() {
    this.#clearPointList();
    render(this.#pointListComponent, this.boardContainer);
    this.#renderPoints();
  }

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }
}
