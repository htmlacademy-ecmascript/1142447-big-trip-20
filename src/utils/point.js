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

export {isPointFuture, isPointPast, isPointPresent, humanizePointTravelDate};
