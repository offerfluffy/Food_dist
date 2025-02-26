window.addEventListener("DOMContentLoaded", () => {
   //Tabs

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

   //Timer

   const deadLine = "2025-05-20";

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
      modalCloseBtn = document.querySelector("[data-close]"),
      modal = document.querySelector(".modal");

   const modalTimerId = setTimeout(showModal, 10000);

   modalTriggers.forEach((modalTrigger) => {
      modalTrigger.addEventListener("click", showModal);
   });

   modalCloseBtn.addEventListener("click", hideModal);

   modal.addEventListener("click", (e) => {
      const target = e.target;

      if (target && target === modal) {
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
});
