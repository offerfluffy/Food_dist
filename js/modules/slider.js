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
