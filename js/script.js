import tabs from "./modules/tabs";
import modal from "./modules/modal";
import timer from "./modules/timer";
import menu from "./modules/menu";
import forms from "./modules/forms";
import slider from "./modules/slider";
import calculator from "./modules/calculator";

import { showModal } from "./modules/modal";

window.addEventListener("DOMContentLoaded", () => {
  const modalTimerId = setTimeout(
    () => showModal(".modal", modalTimerId),
    10000
  );

  tabs();
  modal("[data-modal]", ".modal", modalTimerId);
  timer();
  menu();
  forms("form", modalTimerId);
  slider({
    container: ".offer__slider",
    nextArrow: ".offer__slider-next",
    previousArrow: ".offer__slider-prev",
    slide: ".offer__slide",
    totalCounter: "#total",
    currentCounter: "#current",
    wrapper: ".offer__slider-wrapper",
    field: ".offer__slider-inner",
  });
  calculator();
});
