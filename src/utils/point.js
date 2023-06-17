import dayjs from 'dayjs';
const DATE_FORMAT = 'DD MMMM';
const DATE_MONTH_FORMAT = 'MMMM DD';

function humanizePointTravelDate(travelDate) {
  return travelDate ? dayjs(travelDate).format(DATE_FORMAT) : '';
}
function humanizePointTravelDateMonth(travelDate) {
  return travelDate ? dayjs(travelDate).format(DATE_MONTH_FORMAT) : '';
}
function isPointFuture(travelDate) {
  return travelDate && dayjs().isAfter(travelDate, 'DD');
}
/*function isTravelRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}*/

function isPointPresent(travelDate) {
  return travelDate && dayjs(travelDate).isSame(dayjs(), 'DD');
}
function isPointPast(travelDate) {
  return travelDate && dayjs().isBefore(travelDate, 'DD');
}


//export {isPointFuture, isPointPast, isPointPresent, humanizePointTravelDate};
// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortPointUp(pointA, pointB) {
  const durationA = dayjs(pointA.dateStop).diff(pointA.dateStart) ?? 0;
  const durationB = dayjs(pointB.dateStop).diff(pointB.dateStart) ?? 0;
  return durationB - durationA;
}

function sortPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointDown(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointB.dueDate).diff(dayjs(pointA.dueDate));
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {humanizePointTravelDate, humanizePointTravelDateMonth, sortPrice, sortPointUp, sortPointDown,
  isPointFuture, isPointPresent, isPointPast, isDatesEqual};
