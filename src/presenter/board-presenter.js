import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import {render, RenderPosition} from '../framework/render.js';
import PointsModel from '../models/points-model.js';
import PointPresenter from './point-presenter.js';
//import {updateItem} from '../utils/common.js';
import {sortPointUp, sortPrice} from '../utils/point.js';
//import {SortType} from '../const.js';
//import {SortType, UpdateType, UserAction} from '../const.js';

import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

import {filter} from '../utils/filter.js';

import NewPointPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #pointsModel = new PointsModel();

  #filterModel = null;

  #pointsData = [];
  #offersData = null;
  #destinationsData = null;
  #pointPresenters = new Map();

  #newPointPresenter = null;

  #sortComponent = null;
  #currentSortType = SortType.TIME;
  //#sourcedBoardPoints = [];
 // #boardPoints = [];
  #pointListComponent = new PointListView();

  #noPointComponent = null;

  #filterType = FilterType.ALL;

  constructor({boardContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.boardContainer = boardContainer;
    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
  }

  get points() {

    //const filterType = this.#filterModel.filter;

    this.#filterType = this.#filterModel.filter;

    const points = this.#pointsModel.points;
    //const filteredPoints = filter[filterType](points);

    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        //return [...this.#pointsModel.points].sort(sortPointUp);

        return filteredPoints.sort(sortPointUp);

      case SortType.DATE_DOWN:
        //return [...this.#pointsModel.points].sort(sortPointDown);

        return filteredPoints.sort(sortPointDown);
    }
    //return this.#pointsModel.points;

    return filteredPoints;
  }

  async init(renderFilters) {
    await this.#pointsModel.getRoutePoints();
    await this.#pointsModel.getOffers();
    await this.#pointsModel.getDestinations();

 /* #handleLoadMoreButtonClick = () => {
      const pointCount = this.points.length;
      const newRenderedPointCount = Math.min(pointCount, this.#renderedPointCount + POINT_COUNT_PER_STEP);
      const points = this.points.slice(this.#renderedPointCount, newRenderedPointCount);

      this.#renderPoints(points);
      this.#renderedPointCount = newRenderedPointCount;

      if (this.#renderedPointCount >= pointCount) {
        remove(this.#loadMoreButtonComponent);
      }
    };*/

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

    /*this.#boardPoints = [...this.#pointsModel.points];
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    /*this.#sourcedBoardPoints = [...this.#pointsModel.points];*/

    /*this.#renderBoard();*/
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

  /*#renderPoints() {
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }*/

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  /*
  #renderNoPoints() {
    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }*/

  //#handlePointChange = (updatedPoint) => {
    //this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    //this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    //this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinationsData, this.#offersData);
    //this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);

    #handleViewAction = (actionType, updateType, update) => {
      console.log(actionType, updateType, update);
      // Здесь будем вызывать обновление модели.
      // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
      // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
      // update - обновленные данные
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    };

    #handleModelEvent = (updateType, data) => {
      switch (updateType) {
        case UpdateType.PATCH:
          this.#pointPresenters.get(data.id).init(data);
          break;
        case UpdateType.MINOR:
         break;
        case UpdateType.MAJOR:
          break;
      }

  };

 /*#sortPoints(sortType) {
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

    this.#currentSortType = sortType;*/
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    //this.#sortType;
    this.#currentSortType = sortType;
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
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  /*#renderPointList() {
    const pointCount = this.points.length;
    const points = this.points.slice(0, Math.min(pointCount, POINT_COUNT_PER_STEP));
    render(this.#pointListComponent, this.#boardComponent.element);
    this.#renderPoints(points);*/

    /*this.#clearPointList();
    render(this.#pointListComponent, this.boardContainer);
    this.#renderPoints();
  }*/
    this.#clearBoard({resetRenderedPointCount: true});
    #clearBoard({resetRenderedPointCount = false, resetSortType = false} = {}) {
      const pointCount = this.points.length;

      this.#newPointPresenter.destroy();

      this.#pointPresenters.forEach((presenter) => presenter.destroy());
      this.#pointPresenters.clear();

      remove(this.#sortComponent);
      remove(this.#noPointComponent);
      remove(this.#loadMoreButtonComponent);

      if (resetRenderedPointCount) {
        this.#renderedPointCount = POINT_COUNT_PER_STEP;
      } else {
        // На случай, если перерисовка доски вызвана
        // уменьшением количества задач (например, удаление или перенос в архив)
        // нужно скорректировать число показанных задач
        this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
      }

      if (resetSortType) {
        this.#currentSortType = SortType.DEFAULT;
      }

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    #renderBoard();

    render(this.#boardComponent, this.#boardContainer);
    //if (this.points.every((task) => point.isArchive)) {
      const points = this.points;
      const pointCount = points.length;

      if (pointCount === 0) {
      this.#renderNoPoints();
      }

      #renderNoPoints() {
        this.#noPointComponent = new NoPointView({
          filterType: this.#filterType
        });

    /*if (this.#boardPoints.every((point) => point.isArchive)) {
      this.#renderNoPoints();
      return;
    }*/
    this.#renderSort();
    //this.#renderPointList();

    render(this.#pointListComponent, this.#boardComponent.element);

    // Теперь, когда #renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу POINT_COUNT_PER_STEP на свойство #renderedPointCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this.#renderPoints(points.slice(0, Math.min(pointCount, this.#renderedPointCount)));

    if (pointCount > this.#renderedPointCount) {
      this.#renderLoadMoreButton();
    }
  }
