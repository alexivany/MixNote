"use strict"

const guitarTab = document.querySelector(".guitar-tab");

function addGuitarRow(guitarTemplate, replace = false) {
  const guitarHTML = template
  .split("")
  .map((e) => {
    if (e === "-" || e.match(/[0-9+]/))
      return `<span class='is-editable'>${e}</span>`;
    return `<span>${e}</span>`;
  })
  .join("");
  replace ? (guitarTab.innerHTML = guitarHTML) : (guitarTab.innerHTML += guitarHTML);
  const tabCell = document.querySelectorAll("#tab-cell");
  let isMoving = false;
  let dragging;
}