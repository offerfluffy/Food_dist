window.addEventListener("DOMContentLoaded", () => {
  // Tabs

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

  // Timer

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

  // Modal

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

  // Menu field

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

  // Forms

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

  // Slider

  const slides = document.querySelectorAll(".offer__slide"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesFiled = document.querySelector(".offer__slider-inner"),
    sliderPrevious = document.querySelector(".offer__slider-prev"),
    sliderNext = document.querySelector(".offer__slider-next"),
    sliderCurrent = document.querySelector("#current"),
    sliderTotal = document.querySelector("#total"),
    width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1;
  let offset = 0;

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

    sliderCurrent.textContent = getZero(slideIndex);
    slidesFiled.style.transform = `translateX(-${offset}px)`;
  });

  sliderPrevious.addEventListener("click", () => {
    if (offset == 0) {
      offset = widthValue() * (slides.length - 1);
    } else {
      offset -= widthValue();
    }

    if (slideIndex === 0) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    sliderCurrent.textContent = getZero(slideIndex);
    slidesFiled.style.transform = `translateX(-${offset}px)`;
  });

  function widthValue() {
    return +width.slice(0, width.length - 2);
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
});
