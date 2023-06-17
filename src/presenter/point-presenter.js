import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType} from '../const.js';

import {isPointRepeating, isDatesEqual} from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, /*onDataChange,*/ onModeChange}) {
    this.#pointListContainer = pointListContainer;
    //this.#handleDataChange = onDataChange;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );

    this.#handleModeChange = onModeChange;
  }

  init(point, destinations, offers) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;


    this.#pointComponent = new PointView({
      point: this.#point,
      destinations,
      offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations,
      offers,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleFormSubmit
    });
    /*
    render(this.#pointComponent, this.#pointListContainer);
    */

    if (!prevPointComponent || !prevPointEditComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      if (this.#mode === Mode.EDITING) {
        replace(this.#pointEditComponent, prevPointEditComponent);
      }
    }
    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }


  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  /*
    #handleArchiveClick = () => {
      this.#handleDataChange({...this.#point, isArchive: !this.#point.isArchive});
    };
  */
  //#handleFormSubmit = () => {
  //this.#handleDataChange(this.#point);

  #handleFormSubmit = (update) => {
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление
    const isMinorUpdate =
        !isDatesEqual(this.#point.dueDate, update.dueDate) ||
        isPointRepeating(this.#point.repeating) !== isPointRepeating(update.repeating);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      // UpdateType.MINOR,
      //point,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
    //this.#replaceFormToCard();
  };
}
