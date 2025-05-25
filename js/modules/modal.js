function showModal(modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector);
  modal.classList.add("show");
  document.body.style.overflow = "hidden";

  if (modalTimerId) {
    clearInterval(modalTimerId);
  }
}

function hideModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function modal(triggerSelector, modalSelector, modalTimerId) {
  const modalTriggers = document.querySelectorAll(triggerSelector),
    modal = document.querySelector(modalSelector);

  modalTriggers.forEach((modalTrigger) => {
    modalTrigger.addEventListener("click", () =>
      showModal(modalSelector, modalTimerId)
    );
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      hideModal(modalSelector);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code == "Escape" && e.target.classList.contains(".show")) {
      hideModal(modalSelector);
    }
  });

  window.addEventListener("scroll", showModalByScroll);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      showModal(modalSelector, modalTimerId);
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
}

export default modal;
export { showModal, hideModal };
