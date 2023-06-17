import Observable from '../framework/observable.js';

const url = window.location.href;

/*export default class PointsModel {*/
export default class PointsModel extends Observable {
  #routePoints = [];
  #offers = [];
  #destinations = [];

  get points() {
    return this.#routePoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async getRoutePoints() {
    const result = await fetch(`${url}mockdata/points.json`);
    const data = await result.json();
    this.#routePoints = data;
  }

  async getOffers() {
    const result = await fetch(`${url}mockdata/offers.json`);
    const data = await result.json();
    this.#offers = data;
  }

  async getDestinations() {
    const result = await fetch(`${url}mockdata/destinations.json`);
    const data = await result.json();
    this.#destinations = data;
  }
  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#tasks.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
