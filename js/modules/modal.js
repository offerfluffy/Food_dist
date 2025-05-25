function modal() {
  const modalTriggers = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  const modalTimerId = setTimeout(showModal, 10000);

  modalTriggers.forEach((modalTrigger) => {
    modalTrigger.addEventListener("click", showModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      hideModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code == "Escape" && e.target.classList.contains(".show")) {
      hideModal();
    }
  });

  window.addEventListener("scroll", showModalByScroll);

  function showModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    clearInterval(modalTimerId);
  }

  function hideModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      showModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
}

module.exports = modal;
