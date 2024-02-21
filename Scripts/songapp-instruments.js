"use strict";

import { currentSong, saveCurrentSong } from "./main.js";

const guitarTab = document.querySelector(".guitar-tab");

const bassTab = document.querySelector(".bass-tab");

const guitarTemplate = `
e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  `;

  const bassTemplate = `
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  `

export default class SongAppInstruments {
  // Add tab row with guitar template
  static addGuitarRow(template, replace = false) {
    const guitarTemplate =
      template ||
      `
e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  `;
    const guitarTab = document.querySelector(".guitar-tab");
    const guitarHTML = guitarTemplate
      .split("")
      .map((e) => {
        if (e === "-" || e.match(/[0-9+a-gA-G]/))
          return `<span class='is-editable' id='#tab-cell'>${e}</span>`;
        return `<span id='#tab-cell'>${e}</span>`;
      })
      .join("");
    replace
      ? (guitarTab.innerHTML = guitarHTML)
      : (guitarTab.innerHTML += guitarHTML);
    const tabCells = document.querySelectorAll("span");
    let isMoving = false;
    let dragging;
    Array.prototype.forEach.call(tabCells, (cell) => {
      cell.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isMoving = true;
        dragging = e.target;
      });
      cell.addEventListener("mouseup", (e) => {
        isMoving = false;
      });
      cell.addEventListener("click", (e) => {
        if (!e.target.classList.contains("is-editable")) return;
        const html = e.target.innerHTML;
        e.target.innerHTML = "<input>";
        const input = e.target.querySelector("input");
        if (html != "-") input.value = html;
        input.focus();
        input.addEventListener("blur", (b) => {
          const value = b.target.value != "" ? b.target.value : "-";
          e.target.innerHTML = `${value}`;
          saveCurrentSong();
        });
      });
    });
    document.body.addEventListener("mousemove", (e) => {
      if (isMoving && e.target.classList.contains("is-editable")) {
        const old = dragging.innerHTML;
        const newHTML = e.target.innerHTML;
        dragging.innerHTML = newHTML;
        e.target.innerHTML = old;
        dragging = e.target;
      }
    });
  }

  static downloadGuitarTab() {
    const downloadButton = document.getElementById("guitar-download");
    const guitarTab = document.querySelector(".guitar-tab");
    const filename = `${currentSong.title} Guitar Tab.txt`;
    const tabToDl = guitarTab.innerText;
    const blob = new Blob([tabToDl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    downloadButton.href = url;
    downloadButton.download = filename;
    console.log("clicked");
  }

  static clearGuitarTab() {
    SongAppInstruments.addGuitarRow(guitarTemplate, true);
  }
}
