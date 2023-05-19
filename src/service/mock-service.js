import getRandomPoint from '../mockdata/points.json';
import {mockOffers} from '../mockdata/offers.json';
import {mockDestinations} from '../mockdata/destinations.json';

const POINTS_COUNT = 10;

export default class MockService {
  #points = [];
  #offers = [];
  #destinations = [];

  constructor() {
    this.#points = Array.from({length: POINTS_COUNT}, getRandomPoint);
    this.#offers = mockOffers;
    this.#destinations = mockDestinations;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
