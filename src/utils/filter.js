import {FilterType} from '../const';
import {isPointFuture, isPointPresent, isPointPast} from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter(points),
  [FilterType.FUTURE]: (points) => points.filter(points), isPointFuture(_point.travelDate),
  [FilterType.PRESENT]: (points) => points.filter(points), isPointPresent(_point.travelDate),
  [FilterType.PAST]: (points) => points.filter(points), isPointPast(_point.travelDate),
  [FilterType.FAVORITES]:(points) => points.filter((_points) => isPointFavorites),
};

export {filter};
