"use strict";

const songApp = [];

const currentSong = {};

const songTitle = document.getElementById("song-title");


const tagButton = document.getElementById("tag-button");

const tagsDetails = document.querySelector(".tags-details");

const instrumentArray = [];

const instrumentInput = document.getElementById("instrument-input");

const instrumentNotes = document.querySelector(".instrument-notes");

songApp.push(currentSong);

songTitle.addEventListener("input", () => {
  songTitle.style.width = songTitle.value.length + "ch";
});

songTitle.addEventListener("focusout", () => {
const newTitle = songTitle.value;
currentSong.title = newTitle;
});



function renderInstruments() {
  let instrumentNotesHTML = "";

  for (let i = 0; i < instrumentArray.length; i++) {
    const instrument = instrumentArray[i];
    const html = `<div class="instrument">
    <label for="${instrument}">${instrument}:</label>
    <textarea name="${instrument}" id="${instrument}" cols="30" rows="6"></textarea>
  </div>`;
    instrumentNotesHTML += html;
  }

  instrumentNotes.innerHTML = instrumentNotesHTML;
}

renderInstruments();

instrumentInput.addEventListener("keypress", () => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("instrument-submit").click();
  }
});

function addInstrument() {
  const instrumentChoice = instrumentInput.value;

  instrumentArray.push(instrumentChoice);

  renderInstruments();

  instrumentInput.value = "";
}
