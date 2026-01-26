import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  toggleButtonState,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "05ca3e3e-56d1-42bf-aa7c-39390b22403a",
    "Content-Type": "application/json",
  },
});

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = document.querySelector("#profile-name-input");
const editProfileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const editAvatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = document.querySelector("#avatar-link-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostImageInput = document.querySelector("#card-image-input");
const newPostCaptionInput = document.querySelector("#new-post-caption-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelButton = deleteModal.querySelector(
  ".modal__submit-btn_type_cancel"
);
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImage = document.querySelector(".modal__image");
const previewCaption = document.querySelector(".modal__caption");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

let selectedCard = null;
let selectedCardId = null;

function escClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", escClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", escClose);
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) closeModal(modal);
  });
});

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  const likes = data.likes || [];

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like-button_active");
  }

  likeButton.addEventListener("click", (evt) => {
    const isLiked = evt.target.classList.contains("card__like-button_active");

    api
      .changeLikeStatus(data._id, isLiked)
      .then(() => {
        evt.target.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  });

  deleteButton.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);

editAvatarBtn.addEventListener("click", () => {
  editAvatarForm.reset();
  resetValidation(editAvatarForm, [avatarLinkInput], settings);
  openModal(editAvatarModal);
});

editAvatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .updateAvatar(avatarLinkInput.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
});

editAvatarCloseBtn.addEventListener("click", () => closeModal(editAvatarModal));

newPostBtn.addEventListener("click", () => openModal(newPostModal));

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .addCard({
      name: newPostCaptionInput.value,
      link: newPostImageInput.value,
    })
    .then((card) => {
      cardsList.prepend(getCardElement(card));
      closeModal(newPostModal);
      newPostForm.reset();
      toggleButtonState(
        [newPostCaptionInput, newPostImageInput],
        submitBtn,
        settings
      );
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
});

newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
});

deleteCancelButton.addEventListener("click", () => closeModal(deleteModal));
deleteCloseBtn.addEventListener("click", () => closeModal(deleteModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    api._userId = userInfo._id;
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;

    cards.forEach((item) => {
      cardsList.append(getCardElement(item));
    });
  })
  .catch(console.error);

enableValidation(settings);
