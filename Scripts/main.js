"use strict";

const songAppList = [];

const currentSong = [];
let currentVersion = {};

// SONG TITLE
const songTitle = document.getElementById("song-title");
const songCross = document.getElementById("song-title-cross");

const songVersions = document.querySelectorAll(".tab-header");

songTitle.addEventListener("input", () => {
  songTitle.style.width = songTitle.value.length + "ch";
});
songTitle.addEventListener("focusout", () => {
  const newTitle = songTitle.value;
  currentSong.title = newTitle;
  updateLocalTime();
});

// Display a delete button during input, then hide
songTitle.addEventListener("input", () => {
  songCross.style.display = "inline";
});
songCross.addEventListener("click", () => {
  songTitle.value = "";
});
songTitle.addEventListener("change", () => {
  setTimeout(() => {
    songCross.style.display = "none";
  }, 1000);
});

// SONG TABS
const addVersionButton = document.querySelector(".tab-add");
let versionsCollection = document.getElementsByClassName("tab-header");
let currentVersionButton = document.querySelector(".tab-active");

currentVersion.version = currentVersionButton.innerText;

activeTabSelection();

// Add up to a maximum of 9 versions
addVersionButton.addEventListener("click", () => {
  if (versionsCollection.length < 9) {
    const newVersion = document.createElement("button");
    const newVersionName = prompt("Enter new version name");
    if (newVersionName === "") {
      return;
    } else {
      newVersion.innerText = newVersionName;
      newVersion.classList.add("tab-header");
      newVersion.addEventListener("click", activeTabSelection);
      addVersionButton.before(newVersion);
      updateLocalTime();
      activeTabSelection();
    }
  } else {
    return;
  }
});

// Switching of the active tab
function activeTabSelection() {
  versionsCollection = document.getElementsByClassName("tab-header");
  for (let i = 0; i < versionsCollection.length; i++) {
    versionsCollection[i].addEventListener("click", () => {
      if (versionsCollection[i].classList.contains("tab-active")) {
        return;
      } else {
        for (let i = 0; i < versionsCollection.length; i++) {
          versionsCollection[i].classList.remove("tab-active");
        }
        versionsCollection[i].classList.add("tab-active");
      }
      saveSong();
      currentVersion = {};
      currentVersionButton = document.querySelector(".tab-active");
      currentVersion.version = currentVersionButton.innerText;
    });
  }
}

// if (currentVersion.colour) {
//   currentVersionButton.style.border = `3px solid ${currentVersion.colour}`;
//   currentVersionButton.style.borderBottom = "none";
// } else {
//   Array.prototype.random = function () {
//     return this[Math.floor(Math.random() * this.length)];
//   };
//   const tabColours = ["#0F62FE", "#F1C21B", "#FF0066"];
//   currentVersionButton.style.border = `3px solid ${tabColours.random()}`;
//   currentVersionButton.style.borderBottom = "none";
// }

// SONG DETAILS
const songKey = document.getElementById("key");
const songBPM = document.getElementById("bpm");

songKey.addEventListener("focusout", () => {
  const newKey = songKey.value;
  currentVersion.key = newKey;
  updateLocalTime();
});
songBPM.addEventListener("focusout", () => {
  const newBPM = songBPM.value;
  currentVersion.bpm = newBPM;
  updateLocalTime();
  saveSong();
  console.log(currentVersion);
});

// SONG TAGS
const tagArray = [];
const tagButton = document.getElementById("tag-button");
const tagContainer = document.querySelector(".tags-container");

// Ask for input after button press, then generate new tag
tagButton.addEventListener("focus", () => {
  tagButton.innerHTML = `<input type="text" name="new-tag" id="new-tag">`;
  const newTagInput = document.getElementById("new-tag");
  newTagInput.addEventListener("keypress", () => {
    if (event.key === "Enter") {
      const newTag = newTagInput.value;
      tagContainer.innerHTML += `<h6>#${newTag}</h6>`;
      tagArray.push(newTag);
      currentVersion.tags = tagArray;
      newTagInput.value = "";
    }
    newTagInput.addEventListener("focusout", () => {
      tagButton.innerHTML = "Add Tags...";
    });
  });
});

// GENERAL NOTES
const generalNotes = document.getElementById("song-general");

generalNotes.addEventListener("focusout", () => {
  currentVersion.generalNotes = generalNotes.value;
  updateLocalTime();
});

// INSTRUMENT NOTES
const instrumentArray = [];
let instrumentTextAreas = document.getElementsByClassName("instrument");
const instrumentInput = document.getElementById("instrument-input");
const instrumentNotesContainer = document.querySelector(".instrument-notes");

// Creates instrument div and adds eventlistener
function createNewInstrument(newInstrument) {
  const newDiv = document.createElement("div");
  const newLabel = document.createElement("p");
  newLabel.innerText = newInstrument;
  newDiv.appendChild(newLabel);
  const newTextArea = document.createElement("textarea");
  newTextArea.setAttribute("name", newInstrument);
  newTextArea.setAttribute("class", "instrument");
  newTextArea.setAttribute("rows", "5");
  newTextArea.addEventListener("focusout", () => {
    currentVersion[newInstrument] = {
      instrument: newInstrument,
      notes: newTextArea.value,
    };
  });
  newDiv.appendChild(newTextArea);
  instrumentNotesContainer.appendChild(newDiv);
}

instrumentInput.addEventListener("keypress", () => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("instrument-submit").click();
  }
});

function addInstrument() {
  const instrumentChoice = instrumentInput.value;

  if (instrumentChoice === "") {
    return;
  } else if (instrumentArray.includes(instrumentChoice)) {
    instrumentInput.value = "";
    const warning = document.createElement("p");
    const warningText = document.createTextNode("Instrument already exists!");
    warning.appendChild(warningText);
    instrumentInput.after(warning);
    setTimeout(() => {
      warning.remove();
    }, 2000);
  } else {
    instrumentArray.push(instrumentChoice);

    createNewInstrument(instrumentChoice);

    instrumentInput.value = "";
  }
}

// MOBILE VIEW
const hamburgerButton = document.querySelector(".hamburger-menu");
const navbarContent = document.querySelector(".content-navbar");
hamburgerButton.addEventListener("click", () => {
  if (navbarContent.style.display === "flex") {
    navbarContent.style.display = "none";
  } else {
    navbarContent.style.display = "flex";
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > "800") {
    navbarContent.style.display = "flex";
  } else {
    return;
  }
});

const DateTime = luxon.DateTime;

const songTime = document.querySelector(".song-time");

function updateLocalTime() {
  const dt = DateTime.now();

  songTime.innerText = dt.toLocaleString(DateTime.DATETIME_MED);
  currentSong.updated = dt.toLocaleString(DateTime.DATETIME_MED);
  if (redBlob.classList.contains("svg-hidden")) {
    greenBlob.classList.toggle("svg-hidden");
    redBlob.classList.toggle("svg-hidden");
  } else {
    return;
  }
}

function getSongs() {
  return JSON.parse(localStorage.getItem("song-list") || "[]");
}

function saveSong() {
  currentSong.push(currentVersion);
  songAppList.push(currentSong);
  localStorage.setItem("song-list", JSON.stringify(songAppList));
}

function saveVersion() {}


// VIEW BUILDER



let mainViewHTML = 
`<div class="song-content">
<div class="song-header">
  <div class="song-header-container">
    <input placeholder="Song Title" type="text" id="song-title" value="${songTitle}"/><img
      src="./SVG/cross.svg"
      id="song-title-cross"
      alt=""
    />
// TAB HEADER ARRAY INSERT
    <button class="tab-add">
      <img src="./SVG/plus.svg" alt="" />
    </button>
  </div>
  <div class="song-label">
    <p class="song-time"></p>
  </div>
</div>
<div class="song-details">
  <div class="tags-details">
    <div class="tags-container"></div>
    <button id="tag-button">Add Tags...</button>
  </div>
  <div class="key-bpm-container">
    <div class="key-details">
      <input
        type="text"
        name="key"
        id="key"
        placeholder="Key"
        maxlength="8"
        value="${songKey}"
      />
    </div>
    <div class="bpm-details">
      <input
        type="text"
        name="bpm"
        id="bpm"
        placeholder="BPM"
        maxlength="6"
        value="${songBPM}"
      />
    </div>
  </div>
</div>
<div class="general-notes">
  <label for="song-general">General Notes:</label>
  <textarea
    name="song-general"
    id="song-general"
    cols="100"
    rows="10"
    value="${generalNotes}"
  ></textarea>
</div>
<div class="add-instrument">
  <input
    list="instruments"
    id="instrument-input"
    name="instrument-input"
  />
  <button onclick="addInstrument();" id="instrument-submit">
    Add Instrument
  </button>
</div>
<div class="instrument-notes"></div>
</div>`