"use strict";

export default class SongAppMobile {
  static addMobileListeners() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > "768") {
        navbarContent.style.display = "flex";
      } else {
        return;
      }
    });
    const hamburgerButton = document.querySelector(".hamburger-menu");
    const navbarContent = document.querySelector(".content-navbar");
    hamburgerButton.addEventListener("click", () => {
      if (navbarContent.style.display === "flex") {
        navbarContent.style.display = "none";
      } else {
        navbarContent.style.display = "flex";
      }
    });
  }
}
