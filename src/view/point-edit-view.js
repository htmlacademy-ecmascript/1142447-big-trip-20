import {humanizePointTravelDate} from '../utils/point.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function createPointEditTemplate(state, point, destinations, offers) {
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${state.point.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${offers.map((offer)=>
      `<div class="event__type-item">
                <input ${offer.type.toLowerCase() === state.point.type.toLowerCase() ? 'checked' : ''} id="event-type-${offer.type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type.toLowerCase()}">
                <label class="event__type-label  event__type-label--${offer.type.toLowerCase()}" for="event-type-${offer.type.toLowerCase()}-1">${offer.type}</label>
              </div>`
    ).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${state.point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${state.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map((destination)=>
      `<option value="${destination.name}"></option>`
    ).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointTravelDate(state.point.dateStart)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointTravelDate(state.point.dateStop)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${state.point.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${state.offers?.map((offer)=>
      `<div class="event__offer-selector">
              <input data-offer-id="${offer.id}" class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" ${state.point.offers.includes(offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.title}-1">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`
    ).join('')}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${state.destination.description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${state.destination.pictures.map((picture) => `
                <img class="event__photo" src="${picture.src}" alt="Event photo">
              `).join('')}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}
export default class PointEditView extends AbstractStatefulView {
  #point = null;
  #offers = [];
  #destinations = [];
  #handleFormSubmit = null;
  #handleEditClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({point, offers, destinations, onFormSubmit, onEditClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this._setState(PointEditView.parsePointToState ({point}));

    this._restoreHandlers();

    this.#setDatepickers();
  }

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    /*this.#onResetClick();*/
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  _restoreHandlers = () => {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetButtonClickHandler);

    this.element.querySelectorAll('.event__type-input')
      .forEach((element) => {
        element.addEventListener('change', this.#typeInputClick);
      });

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock){
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#destinations
      .find((pointDestination) => pointDestination.name === evt.target.value);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    this.updateElement ({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => +element.dataset.offerId)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: +evt.target.value
      }
    });
  };

  get template() {
    const state = {
      ...this._state,
      destination: this.#destinations.find((destination) => destination.id === this._state.point.destination),
      offers: this.#offers.find((offer) => offer.type.toLowerCase() === this._state.point.type.toLowerCase())?.offers
    };
    return createPointEditTemplate(state, this.#point, this.#destinations, this.#offers);
  }

  //перегружаем метод родителя removeElement,
  //чтобы при удалении удалялся более не нужный календарь
  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }


  #dueDateChangeHandler = ([userDate]) => {
    this.updateElement ({
      dueDate:  userDate,
    });
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #setDatepickers = () => {
    const [dateStartElement, dateEndElement] = this.element.querySelectorAll('.event__input--time');
    this.#datepickerStart = flatpickr(
      dateStartElement,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.startDate,
        onClose: this.#dateStartChangeHandler,
        enableTime: true,
        maxDate: this._state.endDate,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
    this.#datepickerEnd = flatpickr(
      dateEndElement,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.endDate,
        onClose: this.#dateEndChangeHandler,
        enableTime: true,
        minDate: this._state.startDate,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  #dateStartChangeHandler = ([userDate]) => {
    this._setState({
      startDate: userDate,
    });
  };

  #dateEndChangeHandler = ([userDate]) => {
    this._setState({
      endDate: userDate,
    });
  };

  /* #setDatepicker() {
    if (this._state.isDueDate) {
      //flatpickr есть смысл инициализировать только в случае, если
      //поле выбора даты доступно для заполнения
      this.#datepicker = flatpickr(
        this.element.querySelector('.card__date'),
        {
          dateFormat: 'j F',
          defaultDate: this._state.dueDate,
          onChange: this.#dueDateChangeHandler,
          //на событие flatpickr передаем наш колбэк
        }
      );
    }
  }*/

  static parsePointToState = ({point}) => ({point});

  static parseStateToPoint = (state) => state.point;
}
