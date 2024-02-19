"use strict";
import SongAppStorage from "./songapp-storage.js";
import SongAppSidebar from "./songapp-sidebar.js";
import SongAppImportExport from "./songapp-importexport.js";
import SongAppVersions from "./songapp-versions.js";
import SongAppTags from "./songapp-tags.js";

export let songAppList = SongAppStorage.getAllSongs();

export let currentSong = {};
export let currentVersion = {};

// SONG TITLE
const songTitle = document.getElementById("song-title");

function addSongTitleListeners() {
  const songCross = document.getElementById("song-title-cross");

  // Automatically adjust width based on characters
  // Display cross to delete during input
  songTitle.addEventListener("input", () => {
    songTitle.style.width = songTitle.value.length + "ch";
    songCross.style.display = "inline";
  });

  // Update current song title on focus out
  songTitle.addEventListener("focusout", () => {
    const newTitle = songTitle.value;
    currentSong.title = newTitle;
    saveCurrentSong();
  });

  // Clear song title when song cross is clicked
  songCross.addEventListener("click", () => {
    songTitle.value = "";
  });

  // Timeout for song cross to disappear
  songTitle.addEventListener("change", () => {
    setTimeout(() => {
      songCross.style.display = "none";
    }, 1000);
  });
}

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
export let tagArray = [];
const tagButton = document.getElementById("tag-button");
const tagContainer = document.querySelector(".tags-container");
let currentTags = document.getElementsByClassName("tag");

// Ask for input after button press, then generate new tag
function addTagButtonListeners() {
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
          SongAppTags.addTagListeners(newTagElement);
        } else {
          tagButton.innerText = "Add Tags...";
        }
      }
    });
    newTagInput.addEventListener("focusout", () => {
      tagButton.innerText = "Add Tags...";
    });
  });
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
  SongAppSidebar.addSongListeners();
  SongAppSidebar.selectDefaultSong();
}

// Remove delete song modal on outside click
const removeSongModal = (e) => {
  const songModal = document.querySelector(".delete-modal");
  if (songModal !== e.target && !songModal.contains(e.target)) {
    document.getElementById("song-app").style.opacity = "1";
    songModal.remove();
    document.removeEventListener("click", removeSongModal);
  }
};

// Display modal to delete selected song
export function deleteSelectedSong() {
  const songModal = document.createElement("div");
  songModal.classList.add("delete-modal");
  const songModalText = document.createElement("p");
  songModalText.innerText = "Delete song?";
  const songModalBtnDiv = document.createElement("div");
  const songModalYes = document.createElement("button");
  songModalYes.innerText = "Yes";
  const songModalNo = document.createElement("button");
  songModalNo.innerText = "No";
  songModal.appendChild(songModalText);
  songModalBtnDiv.appendChild(songModalYes);
  songModalBtnDiv.appendChild(songModalNo);
  songModal.appendChild(songModalBtnDiv);
  document.querySelector("body").appendChild(songModal);

  document.addEventListener("click", removeSongModal);

  document.getElementById("song-app").style.opacity = "0.25";

  songModalYes.addEventListener("click", () => {
    document.removeEventListener("click", removeSongModal);
    const songId = currentSong.id;
    SongAppStorage.deleteSong(songId);
    songAppList = SongAppStorage.getAllSongs();
    SongAppSidebar.clearSongList();
    SongAppSidebar.createSongList();
    SongAppSidebar.addSongListeners();
    SongAppSidebar.selectMostRecentSong();
    document.getElementById("song-app").style.opacity = "1";
    songModal.remove();
  });

  songModalNo.addEventListener("click", () => {
    document.removeEventListener("click", removeSongModal);
    document.getElementById("song-app").style.opacity = "1";
    songModal.remove();
  });
}

function loadDefaultView() {
  // Build song list and select most recent song
  SongAppSidebar.createSongList();
  SongAppSidebar.addSongListeners();
  SongAppSidebar.selectMostRecentSong();

  // Add version button listener
  SongAppVersions.addVersionButtonListener();

  // Add download / upload listeners
  SongAppImportExport.exportCopy();
  SongAppImportExport.importCopy();

  addPrefBtnListener();
  addSongTitleListeners();
  addTagButtonListeners();
  addBlobListeners();
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
      // Find and load color settings
      if (songObject[keys].color) {
        newVersion.style.borderColor = songObject[keys].color;
        newVersion.style.backgroundColor = songObject[keys].color;
        if (songObject[keys].color === "#eef1f4") {
          newVersion.style.color = "#000000";
        } else {
          newVersion.style.color = "#ffffff";
        }
       
        currentVersion.color = songObject[keys].color;
      }
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
  currentVersionButton.style.background = "none";
  currentVersionButton.style.borderColor = currentVersion.color;
  currentVersionButton.style.color = currentVersionButton.style.borderColor;
  currentVersion.version = currentVersionButton.innerText;
  loadVersion(currentVersion.version);
  SongAppVersions.activeTabSelection();
  SongAppTags.addTagListeners();
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

function addPrefBtnListener() {
  const prefButton = document.querySelector(".pref-navbar");
  prefButton.addEventListener("click", () => {
    createSettingsModal();
  });
}

const removeSettingsModal = (e) => {
  const settingsModal = document.querySelector(".settings-modal");
  if (settingsModal !== e.target && !settingsModal.contains(e.target)) {
    settingsModal.remove();
    document.getElementById("song-app").style.opacity = "1";
    document.removeEventListener("click", removeSettingsModal);
  }
};

function createSettingsModal() {
  const settingsModal = document.createElement("div");
  settingsModal.classList.add("settings-modal");
  const fontSliderLabel = document.createElement("label");
  fontSliderLabel.setAttribute("for", "font-slider");
  fontSliderLabel.innerText = "Font Size:";
  const fontSlider = document.createElement("input");
  fontSlider.type = "range";
  fontSlider.name = "font-slider";
  fontSlider.id = "font-slider";
  fontSlider.step = "2";
  fontSlider.min = "12";
  fontSlider.max = "20";
  fontSlider.value = "16";
  settingsModal.appendChild(fontSliderLabel);
  settingsModal.appendChild(fontSlider);
  document.querySelector("body").appendChild(settingsModal);

  document.getElementById("song-app").style.opacity = "0.25";

  setTimeout(() => {
    document.addEventListener("click", removeSettingsModal);
  }, 200);

  fontSlider.addEventListener("click", () => {
    document.querySelector("html").style.fontSize = fontSlider.value + "px";
  });
}

function addBlobListeners() {
  const blobContainer = document.querySelector(".blob-container");
  const blobs = blobContainer.getElementsByTagName("*");

  for (let i = 0; i < blobs.length; i++) {
    const element = blobs[i];

    element.addEventListener("click", () => {
      const activeTab = document.querySelector(".tab-active");
      switch (element.id) {
        case "red-blob":
          currentVersion.color = "#ef4444";
          activeTab.style.borderColor = "#ef4444";
          activeTab.style.backgroundColor = "#ef4444";
          activeTab.style.color = "#ffffff";
          break;
        case "orange-blob":
          currentVersion.color = "#f97316";
          activeTab.style.borderColor = "#f97316";
          activeTab.style.backgroundColor = "#f97316";
          activeTab.style.color = "#ffffff";
          break;
        case "yellow-blob":
          currentVersion.color = "#facc15";
          activeTab.style.borderColor = "#facc15";
          activeTab.style.backgroundColor = "#facc15";
          activeTab.style.color = "#ffffff";
          break;
        case "green-blob":
          currentVersion.color = "#22c55e";
          activeTab.style.borderColor = "#22c55e";
          activeTab.style.backgroundColor = "#22c55e";
          activeTab.style.color = "#ffffff";
          break;
        case "teal-blob":
          currentVersion.color = "#14b8a6";
          activeTab.style.borderColor = "#14b8a6";
          activeTab.style.backgroundColor = "#14b8a6";
          activeTab.style.color = "#ffffff";
          break;
        case "cyan-blob":
          currentVersion.color = "#06b6d4";
          activeTab.style.borderColor = "#06b6d4";
          activeTab.style.backgroundColor = "#06b6d4";
          activeTab.style.color = "#ffffff";
          break;
        case "blue-blob":
          currentVersion.color = "#3b82f6";
          activeTab.style.borderColor = "#3b82f6";
          activeTab.style.backgroundColor = "#3b82f6";
          activeTab.style.color = "#ffffff";
          break;
        case "purple-blob":
          currentVersion.color = "#a855f7";
          activeTab.style.borderColor = "#a855f7";
          activeTab.style.backgroundColor = "#a855f7";
          activeTab.style.color = "#ffffff";
          break;
        case "pink-blob":
          currentVersion.color = "#ec4899";
          activeTab.style.borderColor = "#ec4899";
          activeTab.style.backgroundColor = "#ec4899";
          activeTab.style.color = "#ffffff";
          break;
          case "grey-blob":
            currentVersion.color = "#eef1f4";
            activeTab.style.borderColor = "#eef1f4";
            activeTab.style.backgroundColor = "#eef1f4";
            activeTab.style.color = "#000000";
            break;
      }
      saveCurrentSong();
    });
  }
}
