"use strict";
import SongAppStorage from "./songapp-storage.js";

import SongAppSidebar from "./songapp-sidebar.js";

import SongAppImportExport from "./songapp-importexport.js";

export let songAppList = SongAppStorage.getAllSongs();

export let currentSong = {};
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
export function createDefaultVersion() {
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
      addVersionButton.before(newVersion);
      updateLocalTime();
      activeTabSelection(newVersion);
      // Add unique ID
    }
  } else {
    return;
  }
});

// Switching of the active tab
function activeTabSelection(newVersion) {
  versionsCollection = document.getElementsByClassName("tab-header");

  if (newVersion) {
    newVersion.addEventListener("click", () => {
      for (let i = 0; i < versionsCollection.length; i++) {
        if (newVersion.classList.contains("tab-active")) {
          return;
        } else {
          for (let i = 0; i < versionsCollection.length; i++) {
            versionsCollection[i].classList.remove("tab-active");
          }
          newVersion.classList.add("tab-active");
        }

        clearVersion();
        currentVersionButton = document.querySelector(".tab-active");
        currentVersion.version = currentVersionButton.innerText;
        loadVersion(currentVersion.version);
      }
    });
    newVersion.addEventListener("dblclick", () => {
      console.log("DBLCLICKED " + newVersion.innerText);
      let versionToDelete = currentVersion.version;
      // console.log(versionToDelete)

      deleteVersion(versionToDelete);
    });
  } else {
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

        clearVersion();
        currentVersionButton = document.querySelector(".tab-active");
        currentVersion.version = currentVersionButton.innerText;
        loadVersion(currentVersion.version);
      });
      versionsCollection[i].addEventListener("dblclick", () => {
        console.log("DBLCLICKED " + [i]);
        // let versionToDelete = currentVersion.version;
        // console.log(versionToDelete)

        deleteVersion(currentVersion.version);
      });
    }
  }
}

function deleteConsole() {
  console.log("delete");
}

function deleteVersion(versionToDelete) {
  const versionModal = document.querySelector(".delete-modal");
  const versionModalYes = document.getElementById("delete-modal-yes");
  const versionModalNo = document.getElementById("delete-modal-no");
  const versionModalText = document.getElementById("delete-modal-text");
  versionModalText.innerText = "Delete version?";
  versionModal.classList.toggle("hidden");
  versionModalYes.removeEventListener("click", deleteConsole(), true);
  versionModalYes.addEventListener("click", () => {
    deleteConsole();
    
    // delete currentSong[versionToDelete];
    // versionsCollection[i].remove();
    // versionModal.classList.toggle("hidden");
    // tabContainer.firstElementChild.classList.add("tab-active");
    // let defaultVersion = tabContainer.firstElementChild.innerText;
    // clearVersion();
    // loadVersion(defaultVersion);

    // saveCurrentSong();
    // // Add to array
  });

  versionModalNo.addEventListener("click", () => {
    versionModal.classList.add("hidden");
  });
}

// function addVersionDeleteListener(newVersion) {
//   versionsCollection = document.getElementsByClassName("tab-header");
//   Look for matching ID if already has event listener
//   if (newVersion) {
//     newVersion.addEventListener("dblclick", () => {
//       const versionModal = document.querySelector(".delete-modal");
//       const versionModalYes = document.getElementById("delete-modal-yes");
//       const versionModalNo = document.getElementById("delete-modal-no");
//       const versionModalText = document.getElementById("delete-modal-text");
//       versionModalText.innerText = "Delete version?";
//       versionModal.classList.toggle("hidden");

//       versionModalYes.addEventListener("click", () => {
//         console.log(versionsCollection);
//         let versionToDelete = newVersion.innerText;
//         delete currentSong[versionToDelete];
//         newVersion.remove();
//         versionModal.classList.toggle("hidden");
//         tabContainer.firstElementChild.classList.add("tab-active");
//         saveCurrentSong();
//       });

//       versionModalNo.addEventListener("click", () => {
//         versionModal.classList.add("hidden");
//       });
//     });
//   } else {
//     for (let i = 0; i < versionsCollection.length; i++) {
//       versionsCollection[i].addEventListener("dblclick", () => {
//         const versionModal = document.querySelector(".delete-modal");
//         const versionModalYes = document.getElementById("delete-modal-yes");
//         const versionModalNo = document.getElementById("delete-modal-no");
//         const versionModalText = document.getElementById("delete-modal-text");
//         versionModalText.innerText = "Delete version?";
//         versionModal.classList.toggle("hidden");

//         versionModalYes.addEventListener("click", () => {
//           let versionToDelete = versionsCollection[i].innerText;
//           console.log(currentSong[versionToDelete]);
//           delete currentSong[versionToDelete];
//           versionsCollection[i].remove();
//           versionModal.classList.toggle("hidden");
//           tabContainer.firstElementChild.classList.add("tab-active");
//           let defaultVersion = tabContainer.firstElementChild.innerText;
//           clearVersion();
//           loadVersion(defaultVersion);

//           saveCurrentSong();
//           // Add to array
//         });

//         versionModalNo.addEventListener("click", () => {
//           versionModal.classList.add("hidden");
//         });
//       });
//     }
//   }
// }

// Clear version from DOM
function clearVersion() {
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
function loadVersion(loadedVersion) {
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
        addTagDeleteListener(newTagElement);
        addTagSearchListener(newTagElement);
      } else {
        tagButton.innerText = "Add Tags...";
      }
    }
  });
  newTagInput.addEventListener("focusout", () => {
    tagButton.innerText = "Add Tags...";
  });
});

// Listen on tags for dblclick to delete tag
function addTagDeleteListener(newTag) {
  currentTags = document.getElementsByClassName("tag");
  if (newTag) {
    newTag.addEventListener("dblclick", () => {
      const tagModal = document.querySelector(".delete-modal");
      const tagModalYes = document.getElementById("delete-modal-yes");
      const tagModalNo = document.getElementById("delete-modal-no");
      const tagModalText = document.getElementById("delete-modal-text");
      tagModalText.innerText = "Delete tag?";
      tagModal.classList.toggle("hidden");

      tagModalYes.addEventListener("click", () => {
        let tagToDelete = newTag.innerText;
        let tagToDeleteIndex = currentSong.tags.indexOf(tagToDelete);
        if (tagToDeleteIndex > -1) {
          currentSong.tags.splice(tagToDeleteIndex, 1);
        }
        newTag.remove();
        tagModal.classList.toggle("hidden");
        saveCurrentSong();
      });

      tagModalNo.addEventListener("click", () => {
        tagModal.classList.add("hidden");
      });
    });
  } else {
    for (let i = 0; i < currentTags.length; i++) {
      currentTags[i].addEventListener("dblclick", () => {
        const tagModal = document.querySelector(".delete-modal");
        const tagModalYes = document.getElementById("delete-modal-yes");
        const tagModalNo = document.getElementById("delete-modal-no");
        const tagModalText = document.getElementById("delete-modal-text");
        tagModalText.innerText = "Delete tag?";
        tagModal.classList.toggle("hidden");

        tagModalYes.addEventListener("click", () => {
          let tagToDelete = currentTags[i].innerText;
          let tagToDeleteIndex = currentSong.tags.indexOf(tagToDelete);
          console.log("CLICKED"+ [i]);
          if (tagToDeleteIndex > -1) {
            currentSong.tags.splice(tagToDeleteIndex, 1);
          }
          currentTags[i].remove();
          tagModal.classList.toggle("hidden");
          // saveCurrentSong();
        });

        tagModalNo.addEventListener("click", () => {
          tagModal.classList.add("hidden");
        });
      });
    }
  }
}

function addTagSearchListener(newTag) {
  currentTags = document.getElementsByClassName("tag");
  if (newTag) {
    newTag.addEventListener("click", () => {
      console.log("CLICKED");
    });
  } else {
    for (let i = 0; i < currentTags.length; i++) {
      currentTags[i].addEventListener("click", () => {
        console.log("CLICKED");
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

function updateLocalTime() {
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
  activeTabSelection();
  addTagDeleteListener();
  addTagSearchListener();
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
  createDefaultVersion();
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
