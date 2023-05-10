import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render} from '../render.js';
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

  async init() {
    this.#pointsData = await this.#pointsModel.getRoutePoints();
    this.#offersData = await this.#pointsModel.getOffers();
    this.#destinationsData = await this.#pointsModel.getDestinations();
    render(new SortView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    render(new PointEditView(this.#pointsData[2], this.#destinationsData, this.#offersData), this.pointListComponent.getElement());

    this.#pointsData.forEach((point) => {
      render(new PointView(point, this.#destinationsData.find((el) => el.id === point.destination),this.#offersData.find((el) => el.type === point.type)), this.pointListComponent.getElement());
    });
  }
}
