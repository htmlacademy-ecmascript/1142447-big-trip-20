import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;
  #point = {
    'dateStart': '',
    'dateStop': '',
    'type': 'Drive',
    'basePrice': 0,
    'offers': [],
    'destination': null,
    'isFavorite': true
  };

  #offers = [];
  #destinations = [];


  constructor({pointListContainer, onDataChange, onDestroy, destinations, offers}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      isEditing: false
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
