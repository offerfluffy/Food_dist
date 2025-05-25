window.addEventListener("DOMContentLoaded", () => {
  const tabs = require("./modules/tabs"),
    modal = require("./modules/modal"),
    timer = require("./modules/timer"),
    menu = require("./modules/menu"),
    forms = require("./modules/forms"),
    slider = require("./modules/slider"),
    calculator = require("./modules/calculator");

  tabs();
  modal();
  timer();
  menu();
  forms();
  slider();
  calculator();
});
