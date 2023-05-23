import {FilterTypes} from '../const';
import {isPointFuture, isPointPresent, isPointPast} from './point';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => points.slice(),
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateStart)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateStart)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point.dateStart)),
  /*[FilterType.FAVORITES]:(points) => points.filter((_points) => isPointFavorites),*/
};

export {filter};
