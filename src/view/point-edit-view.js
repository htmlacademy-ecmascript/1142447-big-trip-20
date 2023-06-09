import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointTravelDate} from '../utils/point.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createPointEditTemplate(state, point, destinations, offers) {
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${offers.map((offer)=>
      `<div class="event__type-item">
                <input id="event-type-${offer.type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type.toLowerCase()}">
                <label class="event__type-label  event__type-label--${offer.type.toLowerCase()}" for="event-type-${offer.type.toLowerCase()}-1">${offer.type}</label>
              </div>`
    ).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations.find((item)=>item.id === point.destination).name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map((destination)=>
      `<option value="${destination.name}"></option>`
    ).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointTravelDate(point.dateStart)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointTravelDate(point.dateStop)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
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
            ${offers.find((item)=>item.type === point.type).offers.map((offer)=>
      `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" ${point.offers.includes(offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.title}-1">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`
    )}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinations.find((destination)=>destination.id === point.destination).description}</p>
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

  constructor({point, offers, destinations, onFormSubmit, onEditClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this._setState(PointEditView.parsePointToState ({point}));

    this._restoreHandlers();


    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetButtonClickHandler);

    this.element.querySelectorAll('.event_type-input')
    .forEach((element) => {
      element.addEventListener('change', this.#type(inputClick))
    });

    this.element
    .querySelector('.event_input--destination')
    .addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element
    .querySelector('.event__available-offers');

    if (offerBlock){
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.element
    .querySelector('.event_input--price')
    .addEventListener('change', this.#priceInputChange);
    };

    #resetButtonClickHandler = (evt) => {
      evt.preventDefault();
      this.#onResetClick();
    };

    #formSubmitHandler = (evt) => {
      evt.preventDefault();
      this.#onSabmitClick(PointEditView.parseStateToPoint(this._state))
    }

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

    #destinationInputChange = (evt) =>
    evt.preventDefault();

    const = selectedDestination = this.#pointDestinations

    .find((pointDestination) => pointDestination.name === evt.target)

    const = selectedDestinationId = (selectedDestination)


    ? selectedDestination.id
    : null;

    this.updateElement ({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });

    offerClickHandler = (evt) => {
      evt.preventDefault();

      const checkBoxed = Array.from(this.element.querySelectorAll('.event__offer-checkbox: checked'));
    }

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });

    #priceInputChange = (evt) => {
      evt.preventDefault();

      this._setState({
        point: {
          ...this._state.point,
          basePrice: evt.target.valueAsNumber
        }
      });
    };

  getTemplate() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offers);
    state:this._state,
    pointDestinations: this.#pointDestinations,
    pointOffers: this.pointOffers
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  static parsePointToState = ({point}) => ({point});

  static parseStateToPoint = ({state}) => state.point;
}
