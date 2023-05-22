import dayjs from 'dayjs';
const DATE_FORMAT = 'D MMMM';
function humanizePointTravelDate(travelDate) {
  return travelDate ? dayjs(travelDate).format(DATE_FORMAT) : '';
}
function isPointExpired(travelDate) {
  return travelDate && dayjs().isAfter(travelDate, 'D');
}
function isTravelRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}

export {humanizePointTravelDate, isPointExpired, isPointRepeating};
function isPointExpiringToday(travelDate) {
  return travelDate && dayjs(travelDate).isSame(dayjs(), 'D');
}

export {humanizePointTravelDate, isPointExpired, isPointRepeating, isPointExpiringToday};
