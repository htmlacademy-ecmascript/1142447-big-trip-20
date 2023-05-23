import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace} from '../framework/render.js';
import PointsModel from '../models/points-model.js';

export default class BoardPresenter {
  #pointsModel = new PointsModel();
  #pointsData = null;
  #offersData = null;
  #destinationsData = null;
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
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
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
    );
    const pointEditComponent = new PointEditView(
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
}
