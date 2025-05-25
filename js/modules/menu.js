import { getResource } from "../services/services";

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

  clearItem(menuField);

  getResource("http://localhost:3000/menu").then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuItem(img, altimg, title, descr, price).render(menuField);
    });
  });
}

export default menu;
