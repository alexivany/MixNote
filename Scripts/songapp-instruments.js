"use strict";

import { currentSong, saveCurrentSong, currentVersion, loadSong } from "./main.js";

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
  `;

const removeModal = (e) => {
  const instrumentModal = document.querySelector(".delete-modal");
  if (instrumentModal !== e.target && !instrumentModal.contains(e.target)) {
    document.getElementById("song-app").style.opacity = "1";
    instrumentModal.remove();
    document.removeEventListener("click", removeModal);
  }
};

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
        input.select();
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
  }

  static clearGuitarTab() {
    SongAppInstruments.addGuitarRow(guitarTemplate, true);
  }

  static addBassRow(template, replace = false) {
    const bassTemplate =
      template ||
      `
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  `;
    const bassTab = document.querySelector(".bass-tab");
    const bassHTML = bassTemplate
      .split("")
      .map((e) => {
        if (e === "-" || e.match(/[0-9+a-gA-G]/))
          return `<span class='is-editable' id='#tab-cell'>${e}</span>`;
        return `<span id='#tab-cell'>${e}</span>`;
      })
      .join("");
    replace ? (bassTab.innerHTML = bassHTML) : (bassTab.innerHTML += bassHTML);
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
        input.select();
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

  static downloadBassTab() {
    const downloadButton = document.getElementById("bass-download");
    const bassTab = document.querySelector(".bass-tab");
    const filename = `${currentSong.title} Bass Tab.txt`;
    const tabToDl = bassTab.innerText;
    const blob = new Blob([tabToDl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    downloadButton.href = url;
    downloadButton.download = filename;
  }

  static clearBassTab() {
    SongAppInstruments.addBassRow(bassTemplate, true);
  }

  static deleteInstrument(instrumentToDelete) {
    window.scrollTo(0, 0);
    const instrumentModal = document.createElement("div");
    instrumentModal.classList.add("delete-modal");
    const instrumentModalText = document.createElement("p");
    instrumentModalText.innerText = "Delete instrument?";
    const instrumentModalBtnDiv = document.createElement("div");
    const instrumentModalYes = document.createElement("button");
    instrumentModalYes.innerText = "Yes";
    const instrumentModalNo = document.createElement("button");
    instrumentModalNo.innerText = "No";
    instrumentModal.appendChild(instrumentModalText);
    instrumentModalBtnDiv.appendChild(instrumentModalYes);
    instrumentModalBtnDiv.appendChild(instrumentModalNo);
    instrumentModal.appendChild(instrumentModalBtnDiv);
    document.querySelector("body").appendChild(instrumentModal);

    document.getElementById("song-app").style.opacity = "0.25";

    setTimeout(() => {
      document.addEventListener("click", removeModal);
    }, 200);

    instrumentModalYes.addEventListener("click", () => {
      delete currentSong[currentVersion.version][instrumentToDelete];

      const instrumentDivToDelete = document.getElementById(`${instrumentToDelete}-container`);
      instrumentDivToDelete.remove();

      loadSong(currentSong);
      document.removeEventListener("click", removeModal);
      document.getElementById("song-app").style.opacity = "1";
      instrumentModal.remove();
    });

    instrumentModalNo.addEventListener("click", () => {
      document.removeEventListener("click", removeModal);
      document.getElementById("song-app").style.opacity = "1";
      instrumentModal.remove();
    });
  }
}
