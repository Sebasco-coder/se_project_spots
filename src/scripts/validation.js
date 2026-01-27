const showInputError = (formEl, inputEl, errorMessage, settings) => {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(settings.inputErrorClass);
  errorEl.textContent = errorMessage;
  errorEl.classList.add(settings.errorClass);
};

const hideInputError = (formEl, inputEl, settings) => {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(settings.inputErrorClass);
  errorEl.textContent = "";
  errorEl.classList.remove(settings.errorClass);
};

const checkInputValidity = (formEl, inputEl, settings) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, settings);
  } else {
    hideInputError(formEl, inputEl, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputEl) => !inputEl.validity.valid);
};

const toggleButtonState = (inputList, buttonEl, settings) => {
  if (hasInvalidInput(inputList)) {
    buttonEl.classList.add(settings.inactiveButtonClass);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(settings.inactiveButtonClass);
    buttonEl.disabled = false;
  }
};

const setEventListeners = (formEl, settings) => {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const buttonEl = formEl.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonEl, settings);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, settings);
      toggleButtonState(inputList, buttonEl, settings);
    });
  });
};

const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formEl) => {
    setEventListeners(formEl, settings);
  });
};

const resetValidation = (formEl, inputList, settings) => {
  const buttonEl = formEl.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, settings);
  });

  toggleButtonState(inputList, buttonEl, settings);
};

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

export { enableValidation, settings, resetValidation, toggleButtonState };
