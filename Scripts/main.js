"use strict";
import SongAppStorage from "./songapp-storage.js";
import SongAppSidebar from "./songapp-sidebar.js";
import SongAppImportExport from "./songapp-importexport.js";
import SongAppVersions from "./songapp-versions.js";

export let songAppList = SongAppStorage.getAllSongs();

export let currentSong = {};
export let currentVersion = {};

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

// SONG VERSIONS
export const addVersionButton = document.querySelector(".tab-add");
let versionsCollection = document.getElementsByClassName("tab-header");
let currentVersionButton = document.querySelector(".tab-active");
export const tabContainer = document.querySelector(".tab-container");

// Clear current version from DOM
export function clearVersion() {
  currentVersion = {};
  generalNotes.value = "";

  for (let i = 0; i < instrumentNotesContainer.childElementCount; i++) {
    instrumentNotesContainer.removeChild(instrumentNotesContainer.firstChild);
  }
  instrumentArray = [];
  while (
    instrumentNotesContainer.firstChild &&
    instrumentNotesContainer.removeChild(instrumentNotesContainer.firstChild)
  );
}

// Load version from currentSong
export function loadVersion(loadedVersion) {
  if (currentSong.hasOwnProperty(loadedVersion)) {
    if (currentSong[loadedVersion].generalNotes) {
      let loadedNotes = currentSong[loadedVersion].generalNotes;
      currentVersion.generalNotes = loadedNotes;
      generalNotes.value = loadedNotes;
    }
    for (let instruments in currentSong[loadedVersion]) {
      if (typeof currentSong[loadedVersion][instruments] === "object") {
        const instrumentName =
          currentSong[loadedVersion][instruments].instrument;

        createNewInstrument(instrumentName);
        instrumentArray.push(instrumentName);

        const instrumentNotes = document.getElementById(instrumentName);
        instrumentNotes.value = currentSong[loadedVersion][instruments].notes;
        currentVersion[instrumentName] = {
          instrument: instrumentName,
          notes: instrumentNotes.value,
        };
      }
    }
  }
  saveInstrumentListener();
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
let currentTags = document.getElementsByClassName("tag");

// Ask for input after button press, then generate new tag
tagButton.addEventListener("focus", () => {
  tagButton.innerHTML = `<input type="text" name="new-tag" id="new-tag">`;
  const newTagInput = document.getElementById("new-tag");
  newTagInput.addEventListener("keypress", () => {
    if (event.key === "Enter") {
      if (newTagInput.value != "") {
        const newTag = newTagInput.value;
        const newTagElement = document.createElement("h6");
        newTagElement.innerText = newTag;
        newTagElement.setAttribute("class", "tag");
        tagContainer.appendChild(newTagElement);
        tagArray.push(newTag);
        currentSong.tags = tagArray;
        saveCurrentSong();
        newTagInput.value = "";
        addTagListeners(newTagElement);
      } else {
        tagButton.innerText = "Add Tags...";
      }
    }
  });
  newTagInput.addEventListener("focusout", () => {
    tagButton.innerText = "Add Tags...";
  });
});

function deleteTag(tagToDelete) {
  const tagModal = document.createElement("div");
  tagModal.classList.add("delete-modal");
  const tagModalText = document.createElement("p");
  tagModalText.innerText = "Delete tag?";
  const tagModalBtnDiv = document.createElement("div");
  const tagModalYes = document.createElement("button");
  tagModalYes.innerText = "Yes";
  const tagModalNo = document.createElement("button");
  tagModalNo.innerText = "No";
  tagModal.appendChild(tagModalText);
  tagModalBtnDiv.appendChild(tagModalYes);
  tagModalBtnDiv.appendChild(tagModalNo);
  tagModal.appendChild(tagModalBtnDiv);
  document.querySelector("body").appendChild(tagModal);

  tagModalYes.addEventListener("click", () => {
    const tagToDeleteIndex = tagArray.indexOf(tagToDelete.innerText);
    tagArray.splice(tagToDeleteIndex, 1);
    tagToDelete.remove();
    tagModal.remove();
    saveCurrentSong()
  });

  tagModalNo.addEventListener("click", () => {
    tagModal.remove();
  });
}

function addTagListeners(newTag) {
  currentTags = document.getElementsByClassName("tag");
  if (newTag) {
    newTag.addEventListener("click", () => {
      console.log("CLICKED");
    });
    newTag.addEventListener("dblclick", () => {
      deleteTag(newTag);
    });
  } else {
    for (let i = 0; i < currentTags.length; i++) {
      currentTags[i].addEventListener("click", () => {
        console.log("CLICKED");
      });
      currentTags[i].addEventListener("dblclick", () => {
        deleteTag(currentTags[i]);
      });
    }
  }
}

// GENERAL NOTES
const generalNotes = document.getElementById("song-general");

generalNotes.addEventListener("focusout", () => {
  currentVersion.generalNotes = generalNotes.value;
  saveCurrentSong();
});

// INSTRUMENT NOTES
let instrumentArray = [];
let instrumentTextAreas = document.getElementsByClassName("instrument");
const instrumentInput = document.getElementById("instrument-input");
const instrumentNotesContainer = document.querySelector(".instrument-notes");
const instrumentAddButton = document.getElementById("instrument-submit");
let instrumentTextArea = document.getElementsByClassName("instrument");

function saveInstrumentListener() {
  instrumentTextArea = document.getElementsByClassName("instrument");
  for (let i = 0; i < instrumentTextArea.length; i++) {
    instrumentTextArea[i].addEventListener("focusout", () => {
      saveCurrentSong();
    });
  }
}

// Creates instrument div and adds eventlistener
function createNewInstrument(newInstrument) {
  const newDiv = document.createElement("div");
  const newLabel = document.createElement("p");
  newLabel.innerText = newInstrument;
  newDiv.appendChild(newLabel);
  const newTextArea = document.createElement("textarea");
  newTextArea.setAttribute("id", newInstrument);
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
  saveInstrumentListener();
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

export function updateLocalTime() {
  const dt = DateTime.now();

  songTime.innerText = dt.toLocaleString(DateTime.DATETIME_MED);
  currentSong.updated = new Date().toISOString();
}

// Save current song to local storage and songAppList variable
export function saveCurrentSong() {
  updateLocalTime();
  console.log(currentVersion);
  console.log(currentSong);

  currentSong[currentVersion.version] = currentVersion;
  if (currentSong.title === undefined || !currentSong.title) {
    currentSong.title = "My First Song";
    SongAppStorage.saveSong(currentSong);
  } else {
    SongAppStorage.saveSong(currentSong);
  }
  songAppList = SongAppStorage.getAllSongs();
  SongAppSidebar.clearSongList();
  SongAppSidebar.createSongList();
  SongAppSidebar.selectActiveSong();
  SongAppSidebar.selectDefaultSong();
}

function loadDefaultView() {
  // Build song list and select most recent song
  SongAppSidebar.createSongList();
  SongAppSidebar.selectActiveSong();
  SongAppSidebar.selectMostRecentSong();

  // Add version button listener
  SongAppVersions.addVersionButtonListener();

  // Add download / upload listeners
  SongAppImportExport.exportCopy();
  SongAppImportExport.importCopy();
}
loadDefaultView();

// Load song to DOM
export function loadSong(songObject) {
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
        newTagElement.setAttribute("class", "tag");
        newTagElement.innerText = newTag;
        tagContainer.appendChild(newTagElement);
        tagArray.push(newTag);
        currentSong.tags = tagArray;
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
      addVersionButton.before(newVersion);
      for (let i = 0; i < versionsCollection.length; i++) {
        versionsCollection[i].classList.remove("tab-active");
      }
      tabContainer.firstElementChild.classList.add("tab-active");
      currentVersionButton = document.querySelector(".tab-active");
      currentVersion.version = keys;
      currentSong[songObject[keys].version] = currentVersion;
      // Find and load general notes
      if (songObject[keys].generalNotes) {
        generalNotes.value = songObject[keys].generalNotes;
        currentVersion.generalNotes = songObject[keys].generalNotes;
      }
      // Find and create save instrument notes
      for (let instruments in songObject[keys]) {
        if (typeof songObject[keys][instruments] === "object") {
          const instrumentName = songObject[keys][instruments].instrument;
          createNewInstrument(instrumentName);
          const instrumentNotes = document.getElementById(instrumentName);
          instrumentNotes.value = songObject[keys][instruments].notes;
          currentVersion[instrumentName] = songObject[keys][instruments];
          instrumentArray.push(instrumentName);
        }
      }
      clearVersion();
    }
  }

  currentVersionButton = document.querySelector(".tab-active");
  currentVersion.version = currentVersionButton.innerText;
  loadVersion(currentVersion.version);
  SongAppVersions.activeTabSelection();
  addTagListeners();
}

// Clear Song from DOM
function clearSong() {
  // Clear Variables
  currentSong = {};
  clearVersion();
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
}

const newNoteButton = document.querySelector(".new-note-navbar");

// Create new default note
newNoteButton.addEventListener("click", () => {
  clearSong();
  SongAppVersions.createDefaultVersion();
  let songButtons = document.getElementsByClassName("song-navbar");
  for (let i = 0; i < songButtons.length; i++) {
    if (songButtons[i].classList.contains("active-navbar")) {
      songButtons[i].classList.remove("active-navbar");
    }
  }
});

// MODAL
const prefButton = document.querySelector(".pref-navbar");
const settingsModal = document.querySelector(".settings-modal");
prefButton.addEventListener("click", () => {
  const html = document.getElementById("song-app");
  settingsModal.classList.toggle("hidden");
  // window.addEventListener("click", (event) => {
  //   if (!html.contains(event.target)) {
  //     settingsModal.classList.add("hidden");
  //   }
  // });
});

const fontSlider = document.querySelector("#font-slider");
fontSlider.addEventListener("click", () => {
  document.querySelector("html").style.fontSize = fontSlider.value + "px";
});
