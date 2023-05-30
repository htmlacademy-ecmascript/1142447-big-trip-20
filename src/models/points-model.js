const url = window.location.href;
export default class PointsModel {
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
}
