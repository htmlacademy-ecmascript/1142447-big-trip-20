import dayjs from 'dayjs';
const DATE_FORMAT = 'D MMMM';
function humanizePointTravelDate(travelDate) {
  return travelDate ? dayjs(travelDate).format(DATE_FORMAT) : '';
}
function isPointFuture(travelDate) {
  return travelDate && dayjs().isAfter(travelDate, 'D');
}
/*function isTravelRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}*/

function isPointPresent(travelDate) {
  return travelDate && dayjs(travelDate).isSame(dayjs(), 'D');
}
function isPointPast(travelDate) {
  return travelDate && dayjs().isBefore(travelDate, 'D');
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
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointA.dueDate).diff(dayjs(pointB.dueDate));
}

function sortPointDown(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointB.dueDate).diff(dayjs(pointA.dueDate));
}

export {humanizePointTravelDate, sortPointUp, sortPointDown, isPointFuture, isPointPresent, isPointPast};
