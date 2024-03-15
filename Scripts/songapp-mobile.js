"use strict";

export default class SongAppMobile {
  static addMobileListeners() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > "768") {
        navbarContent.style.display = "flex";
        navbarSettings.style.display = "flex";
        navbarSide.style.gap = "1rem";
      } else {
        return;
      }
    });
    const hamburgerButton = document.querySelector(".hamburger-menu");
    const navbarContent = document.querySelector(".content-navbar");
    const navbarSettings = document.querySelector(".settings-navbar");
    const navbarSide = document.querySelector(".side-navbar");
    hamburgerButton.addEventListener("click", () => {
      if (navbarContent.style.display === "flex") {
        navbarContent.style.display = "none";
        navbarSettings.style.display = "none";
        navbarSide.style.gap = "0";
      } else {
        navbarContent.style.display = "flex";
        navbarSettings.style.display = "flex";
        navbarSide.style.gap = "1rem";
      }
    });
  }
}
