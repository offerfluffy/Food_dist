/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator.js":
/*!**********************************!*\
  !*** ./js/modules/calculator.js ***!
  \**********************************/
/***/ ((module) => {

function calculator() {
  const result = document.querySelector(".calculating__result span");
  let sex, height, weight, age, ratio;

  if (localStorage.getItem("sex")) {
    sex = localStorage.getItem("sex");
  } else {
    sex = "female";
    localStorage.setItem("sex", "female");
  }

  if (localStorage.getItem("ratio")) {
    ratio = localStorage.getItem("ratio");
  } else {
    ratio = 1.375;
    localStorage.setItem("ratio", 1.375);
  }

  function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.classList.remove(activeClass);

      if (elem.getAttribute("id") === localStorage.getItem("sex")) {
        elem.classList.add(activeClass);
      }
      if (elem.getAttribute("data-ratio") === localStorage.getItem("ratio")) {
        elem.classList.add(activeClass);
      }
    });
  }

  initLocalSettings("#gender div", "calculating__choose-item_active");
  initLocalSettings(
    ".calculating__choose_big div",
    "calculating__choose-item_active"
  );

  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = "_";
      return;
    }

    if (sex === "female") {
      result.textContent = Math.round(
        (447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
      );
    } else {
      result.textContent = Math.round(
        (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
      );
    }
  }

  function getStaticInfo(parent, activeClass) {
    const elements = document.querySelectorAll(`${parent} div`);

    document.querySelector(parent).addEventListener("click", (e) => {
      if (e.target.classList.contains("calculating__choose-item")) {
        if (e.target.getAttribute("data-ratio")) {
          ratio = +e.target.getAttribute("data-ratio");
          localStorage.setItem("ratio", +e.target.getAttribute("data-ratio"));
        } else {
          sex = e.target.getAttribute("id");
          localStorage.setItem("sex", e.target.getAttribute("id"));
        }

        elements.forEach((elem) => {
          elem.classList.remove(activeClass);
        });

        e.target.classList.add(activeClass);
        calcTotal();
      }
    });
  }

  getStaticInfo("#gender", "calculating__choose-item_active");
  getStaticInfo(".calculating__choose_big", "calculating__choose-item_active");

  function getDinamicInfo(selector) {
    const input = document.querySelector(selector);

    input.addEventListener("input", () => {
      if (input.value.match(/\D/g)) {
        input.style.border = "1px solid red";
      } else {
        input.style.border = "none";
      }

      switch (input.getAttribute("id")) {
        case "height":
          height = +input.value;
          break;
        case "weight":
          weight = +input.value;
          break;
        case "age":
          age = +input.value;
          break;
      }
      calcTotal();
    });
  }

  getDinamicInfo("#height");
  getDinamicInfo("#weight");
  getDinamicInfo("#age");

  calcTotal();
}

module.exports = calculator;


/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
  const forms = document.querySelectorAll("form");

  const message = {
    loading: "img/form/spinner.svg",
    success: "Success",
    failure: "Failure",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
        })
        .catch((e) => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");
    prevModalDialog.classList.add("hide");
    showModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>x</div>
        <div class="modal__title">
          ${message}
        </div>
      </div>
    `;

    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      hideModal();
    }, 4000);
  }
}

module.exports = forms;


/***/ }),

/***/ "./js/modules/menu.js":
/*!****************************!*\
  !*** ./js/modules/menu.js ***!
  \****************************/
/***/ ((module) => {

function menu() {
  const menuField = document.querySelector(".menu__field .container");

  function clearItem(item) {
    item.innerHTML = "";
  }
  class MenuItem {
    constructor(imageSrc, imageALt, subtitle, description, price) {
      this.imageSrc = imageSrc;
      this.imageALt = imageALt;
      this.subtitle = subtitle;
      this.description = description;
      this.price = price;
    }

    render(parent) {
      parent.innerHTML += `
            <div class="menu__item">
                  <img src="${this.imageSrc}" alt="${this.imageALt}" />
                  <h3 class="menu__item-subtitle">Меню "${this.subtitle}"</h3>
                  <div class="menu__item-descr">
                  ${this.description}
                  </div>
                  <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total">
                        <span>${+this.price}</span> грн/день
                        </div>
                  </div>
            </div>
            `;
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`${url}: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  };

  clearItem(menuField);

  getResource("http://localhost:3000/menu").then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuItem(img, altimg, title, descr, price).render(menuField);
    });
  });
}

module.exports = menu;


/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

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


/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
  const slides = document.querySelectorAll(".offer__slide"),
    slider = document.querySelector(".offer__slider"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesFiled = document.querySelector(".offer__slider-inner"),
    sliderPrevious = document.querySelector(".offer__slider-prev"),
    sliderNext = document.querySelector(".offer__slider-next"),
    sliderCurrent = document.querySelector("#current"),
    sliderTotal = document.querySelector("#total"),
    width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1;
  let offset = 0;

  // Slider Indicators

  slider.style.position = "relative";

  const indicators = document.createElement("ol"),
    dots = [];
  indicators.classList.add("carousel-indicators");
  slider.append(indicators);

  for (let i = 0, l = slides.length; i < l; i++) {
    const dot = document.createElement("li");
    dot.setAttribute("data-slide-to", i + 1);
    dot.classList.add("dot");

    if (i === 0) {
      dot.classList.add("dot_active");
    }

    dots.push(dot);
    indicators.append(dot);
  }

  // e.tagret refers to what was clicked (Event Delegation)
  // this refers to element on which was set EventListener (Event Handling)
  indicators.addEventListener("click", function (e) {
    if (e.target.classList.contains("dot")) {
      const slideTo = e.target.getAttribute("data-slide-to"); // string

      slideIndex = +slideTo;
      offset = widthValue() * (slideTo - 1);

      updateSlider();
    }
  });

  // Slider Slides

  sliderTotal.textContent = getZero(slides.length);
  sliderCurrent.textContent = getZero(slideIndex);

  slidesFiled.style.cssText = `
    width: ${100 * slides.length}%;
    display: flex;
    transition: 0.5s all;
  `;

  slidesWrapper.style.overflow = "hidden";

  slides.forEach((slide) => {
    slide.style.width = width;
  });

  sliderNext.addEventListener("click", () => {
    if (offset == widthValue() * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += widthValue();
    }

    if (slideIndex === slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    updateSlider();
  });

  sliderPrevious.addEventListener("click", () => {
    if (offset == 0) {
      offset = widthValue() * (slides.length - 1);
    } else {
      offset -= widthValue();
    }

    if (slideIndex === 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    updateSlider();
  });

  function updateSlider() {
    setActiveDot();
    sliderCurrent.textContent = getZero(slideIndex);
    slidesFiled.style.transform = `translateX(-${offset}px)`;
  }

  function setActiveDot() {
    dots.forEach((dot) => {
      dot.classList.remove("dot_active");
    });
    dots[slideIndex - 1].classList.add("dot_active");
  }

  function widthValue() {
    return +width.replace(/\D/g, ""); //+width.slice(0, width.length - 2);
  }

  // // Slider Image Change

  // const slider = document.querySelector(".offer__slider-counter");
  // const sliderPrevious = slider.querySelector(".offer__slider-prev");
  // const sliderNext = slider.querySelector(".offer__slider-next");
  // const sliderCurrent = slider.querySelector("#current");
  // const sliderTotal = slider.querySelector("#total");
  // const sliderImage = document.querySelector(".offer__slide img");

  // const sliderImages = [
  //   "img/slider/pepper.jpg",
  //   "img/slider/food-12.jpg",
  //   "img/slider/olive-oil.jpg",
  //   "img/slider/paprika.jpg",
  // ];

  // let sliderCounter = 0;
  // const sliderMaxCounter = sliderImages.length - 1;

  // sliderTotal.textContent = getZero(sliderMaxCounter + 1);
  // renderSlider();

  // sliderNext.addEventListener("click", () => {
  //   sliderCounter = incrementCounter(sliderCounter, sliderMaxCounter);
  //   renderSlider();
  // });

  // sliderPrevious.addEventListener("click", () => {
  //   sliderCounter = decrementCounter(sliderCounter, sliderMaxCounter);
  //   renderSlider();
  // });

  // function incrementCounter(counter, maxCount) {
  //   if (counter < maxCount) {
  //     return ++counter;
  //   } else {
  //     return 0;
  //   }
  // }

  // function decrementCounter(counter, maxCount) {
  //   if (counter > 0) {
  //     return --counter;
  //   } else {
  //     return maxCount;
  //   }
  // }

  // function renderSlider() {
  //   sliderCurrent.textContent = getZero(sliderCounter + 1);
  //   updateImageSrc(sliderImages[sliderCounter], sliderImage);
  // }

  // function updateImageSrc(url, img) {
  //   img.setAttribute("src", url);
  // }
}

module.exports = slider;


/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.remove("hide");
    tabsContent[i].classList.add("show", "fade");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (e) => {
    const target = e.target;

    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
}

module.exports = tabs;


/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
  const deadLine = "2025-07-20";

  function getTimeRemaining(endtiem) {
    let days, hours, minutes, seconds;
    const total = Date.parse(endtiem) - Date.parse(new Date());

    if (total <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      (days = Math.floor(total / (1000 * 60 * 60 * 24))),
        (hours = Math.floor((total / (1000 * 60 * 60)) % 24)),
        (minutes = Math.floor((total / (1000 * 60)) % 60)),
        (seconds = Math.floor((total / 1000) % 60));
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timerInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timerInterval);
      }
    }
  }

  setClock(".timer", deadLine);
}

module.exports = timer;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener("DOMContentLoaded", () => {
  const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
    modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
    timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
    menu = __webpack_require__(/*! ./modules/menu */ "./js/modules/menu.js"),
    forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
    slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
    calculator = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator.js");

  tabs();
  modal();
  timer();
  menu();
  forms();
  slider();
  calculator();
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map