"use strict";

const songAppList = [];

const currentSong = [];
const currentTab = {};

songAppList.push(currentSong);
currentSong.push(currentTab);

// SONG TITLE
const songTitle = document.getElementById("song-title");
const songCross = document.getElementById("song-title-cross");

const songVersions = document.querySelectorAll(".tab-header");

const currentVersion = document.querySelector(".tab-active");
currentTab.version = currentVersion.innerText;

songTitle.addEventListener("input", () => {
  songTitle.style.width = songTitle.value.length + "ch";
});
songTitle.addEventListener("focusout", () => {
  const newTitle = songTitle.value;
  currentSong.title = newTitle;
  updateLocalTime();
});
songTitle.addEventListener("input", () => {
  songCross.style.display = "inline";
});
songCross.addEventListener("click", () => {
  songTitle.value = "";
});
songTitle.addEventListener("change", () => {
  setTimeout(() => {
    songCross.style.display = "none";
  }, "600");
});

// TABS
const addVersionButton = document.querySelector(".tab-add");
const versionsCollection = document.getElementsByClassName("tab-header");

addVersionButton.addEventListener("click", () => {
  if (versionsCollection.length < 9) {
    const newVersion = document.createElement("button");
    newVersion.innerText = prompt("Enter new version name");
    newVersion.classList.add("tab-header");
    addVersionButton.before(newVersion);
    updateLocalTime();
  } else {
    return;
  }
});



// SONG DETAILS
const songKey = document.getElementById("key");
const songBPM = document.getElementById("bpm");

songKey.addEventListener("focusout", () => {
  const newKey = songKey.value;
  currentTab.key = newKey;
  updateLocalTime();
});
songBPM.addEventListener("focusout", () => {
  const newBPM = songBPM.value;
  currentTab.bpm = newBPM;
  console.log(currentTab);
  updateLocalTime();
});

// SONG TAGS
const tagArray = [];
const tagButton = document.getElementById("tag-button");
const tagContainer = document.querySelector(".tags-container");

tagButton.addEventListener("focus", () => {
  tagButton.innerHTML = `<input type="text" name="new-tag" id="new-tag">`;
  const newTagInput = document.getElementById("new-tag");
  newTagInput.addEventListener("keypress", () => {
    if (event.key === "Enter") {
      const newTag = newTagInput.value;
      tagContainer.innerHTML += `<h6>#${newTag}</h6>`;
      tagArray.push(newTag);
      currentTab.tags = tagArray;
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
  currentTab.generalNotes = generalNotes.value;
  updateLocalTime();
});

// INSTRUMENT NOTES
const instrumentArray = [];
const instrumentCollection = [];
const instrumentInput = document.getElementById("instrument-input");
const instrumentNotesContainer = document.querySelector(".instrument-notes");

function renderInstruments() {
  let instrumentNotesHTML = "";

  for (let i = 0; i < instrumentArray.length; i++) {
    const instrument = instrumentArray[i];
    const html = `<div>
    <label for="${instrument}">${instrument}:</label>
    <textarea name="${instrument}" id="${instrument}" class="instrument" rows="5"></textarea>
  </div>`;
    instrumentNotesHTML += html;
  }

  instrumentNotesContainer.innerHTML = instrumentNotesHTML;
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

  if (instrumentChoice === "") {
    return;
  } else {
    instrumentArray.push(instrumentChoice);

    renderInstruments();

    instrumentInput.value = "";
  }
}

// MOBILE VIEW
const hamburgerButton = document.querySelector(".hamburger-menu");
const navbarContent = document.querySelector(".content-navbar");
hamburgerButton.addEventListener("click", () => {
  if (navbarContent.style.display === "flex") {
    navbarContent.style.display = "none";
    console.log(window.innerWidth);
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
}
