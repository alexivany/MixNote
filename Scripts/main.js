"use strict";
import SongAppStorage from "./songapp-storage.js";

let songAppList = SongAppStorage.getAllSongs();

let currentSong = {};
let currentVersion = {};

// SONG TITLE
const songTitle = document.getElementById("song-title");
const songCross = document.getElementById("song-title-cross");

const songVersions = document.querySelectorAll(".tab-header");

songTitle.addEventListener("input", () => {
  songTitle.style.width = songTitle.value.length + "ch";
});
// Update Song Title
songTitle.addEventListener("focusout", () => {
  const newTitle = songTitle.value;
  currentSong.title = newTitle;
  saveCurrentSong();
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
const tabContainer = document.querySelector(".tab-container");

// Default version display
function createDefaultVersion() {
  if (versionsCollection.length == 0) {
    const newVersion = document.createElement("button");
    const newVersionName = "First Mix";
    newVersion.innerText = newVersionName;
    newVersion.classList.add("tab-header");
    newVersion.addEventListener("click", activeTabSelection);
    addVersionButton.before(newVersion);
    tabContainer.firstElementChild.classList.add("tab-active");
    currentVersionButton = document.querySelector(".tab-active");
    currentVersion.version = currentVersionButton.innerText;
    currentSong[currentVersion.version] = currentVersion;
  }
}
activeTabSelection();

// Add up to a maximum of 9 versions
addVersionButton.addEventListener("click", () => {
  if (versionsCollection.length < 9) {
    const newVersion = document.createElement("button");
    const newVersionName = prompt("Enter new version name");
    if (newVersionName === "") {
      return;
    } else if (newVersionName === null) {
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
      clearVersion();
      if (versionsCollection[i].classList.contains("tab-active")) {
        return;
      } else {
        for (let i = 0; i < versionsCollection.length; i++) {
          versionsCollection[i].classList.remove("tab-active");
        }
        versionsCollection[i].classList.add("tab-active");
      }
      currentVersionButton = document.querySelector(".tab-active");
      currentVersion.version = currentVersionButton.innerText;
      loadVersion(currentVersion);
    });
  }
}

// Clear version from DOM
function clearVersion() {
  currentVersion = {};
}

// Load version from currentSong
function loadVersion(version) {
    console.log(currentSong);
}

// SONG DETAILS
const songKey = document.getElementById("key");
const songBPM = document.getElementById("bpm");

songKey.addEventListener("focusout", () => {
  const newKey = songKey.value;
  currentSong.key = newKey;
  saveCurrentSong();
});
songBPM.addEventListener("focusout", () => {
  const newBPM = songBPM.value;
  currentSong.bpm = newBPM;
  saveCurrentSong();
});

// SONG TAGS
let tagArray = [];
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
      currentSong.tags = tagArray;
      saveCurrentSong();
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
// SAVE VERSION
// SAVE SONG
});

// INSTRUMENT NOTES
const instrumentArray = [];
let instrumentTextAreas = document.getElementsByClassName("instrument");
const instrumentInput = document.getElementById("instrument-input");
const instrumentNotesContainer = document.querySelector(".instrument-notes");
const instrumentAddButton = document.getElementById("instrument-submit");

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
  newTextArea.setAttribute("placeholder", "Enter notes here...");
  newTextArea.addEventListener("focusout", () => {
    currentVersion[newInstrument] = {
      instrument: newInstrument,
      notes: newTextArea.value,
    };
  });
  newDiv.appendChild(newTextArea);
  instrumentNotesContainer.appendChild(newDiv);
}

instrumentAddButton.addEventListener("click", () => {
  addInstrument();
});

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
  currentSong.updated = new Date().toISOString();
}

// Save current song to local storage and songAppList variable
function saveCurrentSong() {
  console.log(currentVersion);
  console.log(currentSong);
  currentSong[currentVersion.version] = currentVersion;
  if (currentSong.title === undefined || !currentSong.title) {
    currentSong.title = "My First Song";
    SongAppStorage.saveSong(currentSong);
  } else {
    SongAppStorage.saveSong(currentSong);
  }
  updateLocalTime();
  songAppList = SongAppStorage.getAllSongs();
  clearSongList();
  createSongList();
  activeSongSelection();
  selectDefaultSong();
}

// Create & insert a new sidebar button for each song saved in local storage
function createSongList() {
  songAppList.forEach((song) => {
    const currentList = document.querySelector(".content-navbar");
    const sidebar = document.querySelector(".settings-navbar");
    const songTitle = song.title;
    const newSongButton = document.createElement("button");
    const newSongTitle = document.createTextNode(`${songTitle}`);
    newSongButton.classList.add("song-navbar");
    newSongButton.appendChild(newSongTitle);
    sidebar.before(newSongButton);
  });
}

createSongList();

// Clear Song List
function clearSongList() {
  const currentList = document.querySelector(".content-navbar");
  const songButtons = document.querySelectorAll(".song-navbar");
  songButtons.forEach((button) => {
    button.remove();
  });
}

// Selection of songs in the sidebar
function activeSongSelection() {
  let songButtons = document.getElementsByClassName("song-navbar");
  for (let i = 0; i < songButtons.length; i++) {
    songButtons[i].addEventListener("click", () => {
      if (songButtons[i].classList.contains("active-navbar")) {
        return;
      } else {
        for (let i = 0; i < songButtons.length; i++) {
          songButtons[i].classList.remove("active-navbar");
        }
        songButtons[i].classList.add("active-navbar");
      }
      // Check if there is a match in local storage
      const songName = songButtons[i].innerText;
      const existingTitle = songAppList.find((song) => song.title == songName);
      if (existingTitle) {
        loadSong(existingTitle);
      }
    });
  }
}

activeSongSelection();

function defaultSongSelection() {
  let songButtons = document.getElementsByClassName("song-navbar");
  if (songButtons.length >= 1) {
    for (let i = 0; i < songButtons.length; i++) {
      songButtons[0].classList.add("active-navbar");
    }
    // Check if there is a match in local storage
    const songName = songButtons[0].innerText;
    const existingTitle = songAppList.find((song) => song.title == songName);
    if (existingTitle) {
      loadSong(existingTitle);
    }
  } else {
    createDefaultVersion();
  }
}

defaultSongSelection();

// Load song to DOM
function loadSong(songObject) {
  clearSong();
  currentSong.id = songObject.id;
  currentSong.title = songObject.title;
  songTitle.value = songObject.title;
  songTitle.style.width = songTitle.value.length + "ch";
  currentSong.updated = songObject.updated;
  songTime.innerText = DateTime.fromISO(currentSong.updated).toLocaleString(
    DateTime.DATETIME_MED
  );
  if (songObject.key) {
    songKey.value = songObject.key;
    currentSong.key = songObject.key;
  }
  if (songObject.bpm) {
    songBPM.value = songObject.bpm;
    currentSong.bpm = songObject.bpm;
  }
  for (let keys in songObject) {
    // Find and create saved tags
    if (Array.isArray(songObject[keys]) === true) {
      for (let tag in songObject[keys]) {
        const newTag = songObject[keys][tag];
        const newTagElement = document.createElement("h6");
        newTagElement.innerText = "#" + newTag;
        tagContainer.appendChild(newTagElement);
        tagArray.push(newTag);
      }
    }
    // Load versions
    if (
      typeof songObject[keys] === "object" &&
      Array.isArray(songObject[keys]) === false
    ) {
      // Create and load all versions in the tab header
      const newVersion = document.createElement("button");
      const newVersionName = keys;
      newVersion.innerText = newVersionName;
      newVersion.classList.add("tab-header");
      newVersion.addEventListener("click", activeTabSelection);
      addVersionButton.before(newVersion);
      for (let i = 0; i < versionsCollection.length; i++) {
        versionsCollection[i].classList.remove("tab-active");
      }
      tabContainer.firstElementChild.classList.add("tab-active");
      currentVersionButton = document.querySelector(".tab-active");
      currentVersion.version = currentVersionButton.innerText;
      currentSong[songObject[keys].version] = currentVersion;

      if (songObject[keys].generalNotes) {
        generalNotes.value = songObject[keys].generalNotes;
        currentVersion.generalNotes = songObject[keys].generalNotes;
      }
      // Find and create save instrument notes NOT FINISHED
      for (let instruments in songObject[keys]) {
        if (typeof songObject[keys][instruments] === "object") {
          // console.log(songObject[keys][instruments]);
        }
      }
    }
  }
}

// Clear Song from DOM
function clearSong() {
  // Clear Variables
  currentSong = {};
  currentVersion = {};
  songTitle.value = "";
  songTime.innerText = "";
  songBPM.value = "";
  songKey.value = "";
  // Clear Versions
  const versions = document.querySelectorAll(".tab-header");
  const versionParent = document.querySelector(".tab-container");
  versions.forEach((version) => {
    version.classList.remove("tab-active");
    versionParent.removeChild(version);
  });
  // Clear Tags
  while (tagContainer.hasChildNodes()) {
    tagContainer.removeChild(tagContainer.lastChild);
  }
  tagArray = [];
  generalNotes.value = "";
}



const newNoteButton = document.querySelector(".new-note-navbar");

// Create new default note
newNoteButton.addEventListener("click", () => {
  clearSong();
  createDefaultVersion();
  let songButtons = document.getElementsByClassName("song-navbar");
  for (let i = 0; i < songButtons.length; i++) {
    if (songButtons[i].classList.contains("active-navbar")) {
      songButtons[i].classList.remove("active-navbar");
    }
  }
});

// Default Song Selection
function selectDefaultSong() {
  let songButtons = document.getElementsByClassName("song-navbar");
  for (let i = 0; i < songButtons.length; i++) {
    songButtons[0].classList.add("active-navbar");
  }
}

// MODAL
const prefButton = document.querySelector(".pref-navbar");
const settingsModal = document.querySelector(".settings-modal");
prefButton.addEventListener("click", () => {
  const html = document.querySelector("html");
  settingsModal.classList.toggle("hidden");
  window.addEventListener("click", (event) => {
    if (event.target == html) {
      settingsModal.classList.add("hidden");
    }
  });
});

const fontSlider = document.querySelector("#font-slider");
fontSlider.addEventListener("click", () => {
  document.querySelector("html").style.fontSize = fontSlider.value + "px";
});
