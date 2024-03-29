"use strict";
import SongAppStorage from "./songapp-storage.js";
import SongAppSidebar from "./songapp-sidebar.js";
import SongAppImportExport from "./songapp-importexport.js";
import SongAppVersions from "./songapp-versions.js";
import SongAppTags from "./songapp-tags.js";
import SongAppInstruments from "./songapp-instruments.js";
import SongAppMobile from "./songapp-mobile.js";
import SongAppSettings from "./songapp-settings.js";
import SongAppTheme from "./songapp-theme.js";

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

  songTitle.addEventListener("keypress", () => {
    if (event.key === "Enter") {
      songTitle.blur();
    }
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

const sortableVersionList = Sortable.create(tabContainer);

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
    // Load general notes
    if (currentSong[loadedVersion].generalNotes) {
      let loadedNotes = currentSong[loadedVersion].generalNotes;
      currentVersion.generalNotes = loadedNotes;
      generalNotes.value = loadedNotes;
    }
    // Create each instrument div from objects
    for (let instruments in currentSong[loadedVersion]) {
      if (typeof currentSong[loadedVersion][instruments] === "object") {
        const instrumentName =
          currentSong[loadedVersion][instruments].instrument;

        rebuildInstrument(instrumentName);
        instrumentArray.push(instrumentName);

        const instrumentNotes = document.getElementById(instrumentName);
        instrumentNotes.value = currentSong[loadedVersion][instruments].notes;
        const instrumentLabel = document.getElementById(
          `${instrumentName}-label`
        );
        instrumentLabel.value = currentSong[loadedVersion][instruments].label;
        currentVersion[instrumentName] = {
          instrument: instrumentName,
          notes: instrumentNotes.value,
          label: instrumentLabel.value,
          tabs: currentSong[loadedVersion][instruments].tabs,
        };
      }
    }

    // Load color theme
    if (currentSong[loadedVersion].color) {
      currentVersion.color = currentSong[loadedVersion].color;
      // Standard Buttons
      document.getElementById("download-button").style.backgroundColor =
        currentVersion.color;
      document.getElementById("file-upload-label").style.backgroundColor =
        currentVersion.color;
      document.getElementById("instrument-submit").style.backgroundColor =
        currentVersion.color;

      if (currentSong[loadedVersion].color === "#eef1f4") {
        document.querySelector(".tab-active").style.color = "#000000";
        document.querySelector("a").style.color = "#000000";
        document.getElementById("file-upload-label").style.color = "#000000";
        document.getElementById("instrument-submit").style.color = "#000000";
      } else {
        document.querySelector("a").style.color = "#ffffff";
        document.getElementById("file-upload-label").style.color = "#ffffff";
        document.getElementById("instrument-submit").style.color = "#ffffff";
      }
      // Guitar Buttons
      if (currentSong[loadedVersion].Guitar) {
        document.getElementById("guitar-add").style.backgroundColor =
          currentVersion.color;
        document.getElementById("guitar-clear").style.backgroundColor =
          currentVersion.color;
        document.getElementById("guitar-download").style.backgroundColor =
          currentVersion.color;
        if (currentSong[loadedVersion].color === "#eef1f4") {
          document.getElementById("guitar-add").style.color = "#000000";
          document.getElementById("guitar-clear").style.color = "#000000";
          document.getElementById("guitar-download").style.color = "#000000";
        } else {
          document.getElementById("guitar-add").style.color = "#ffffff";
          document.getElementById("guitar-clear").style.color = "#ffffff";
          document.getElementById("guitar-download").style.color = "#ffffff";
        }
      }
      // Bass Buttons
      if (currentSong[loadedVersion].Bass) {
        document.getElementById("bass-add").style.backgroundColor =
          currentVersion.color;
        document.getElementById("bass-clear").style.backgroundColor =
          currentVersion.color;
        document.getElementById("bass-download").style.backgroundColor =
          currentVersion.color;
        if (currentSong[loadedVersion].color === "#eef1f4") {
          document.getElementById("bass-add").style.color = "#000000";
          document.getElementById("bass-clear").style.color = "#000000";
          document.getElementById("bass-download").style.color = "#000000";
        } else {
          document.getElementById("bass-add").style.color = "#ffffff";
          document.getElementById("bass-clear").style.color = "#ffffff";
          document.getElementById("bass-download").style.color = "#ffffff";
        }
      }
    } else {
      return;
    }
  }
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

const removeTagInput = (e) => {
  const tagInput = document.getElementById("new-tag");
  const addTagButton = document.getElementById("tag-button");
  if (addTagButton !== e.target && !addTagButton.contains(e.target)) {
    tagInput.remove();
    addTagButton.innerText = "Add Tags...";
    document.removeEventListener("click", removeTagInput);
  }
};

// Ask for input after button press, then generate new tag
function addTagButtonListeners() {
  tagButton.addEventListener("click", () => {
    const newTagInput = document.createElement("input");
    newTagInput.name = "new-tag";
    newTagInput.id = "new-tag";
    tagButton.innerText = "";
    tagButton.appendChild(newTagInput);
    newTagInput.select();
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
          SongAppTags.checkTagContainerGap();
        } else {
          newTagInput.remove();
          tagButton.innerText = "Add Tags...";
        }
      }
    });
    setTimeout(() => {
      document.addEventListener("click", removeTagInput);
    }, 2000);

    newTagInput.addEventListener("focusout", () => {
      if (newTagInput.value != "") {
        const newTag = newTagInput.value;
        const newTagElement = document.createElement("h6");
        newTagElement.innerText = newTag;
        newTagElement.setAttribute("class", "tag");
        tagContainer.appendChild(newTagElement);
        tagArray.push(newTag);
        currentSong.tags = tagArray;
        saveCurrentSong();
        SongAppTags.addTagListeners(newTagElement);
        SongAppTags.checkTagContainerGap();
        newTagInput.remove();
        tagButton.innerText = "Add Tags...";
      } else {
        newTagInput.remove();
        tagButton.innerText = "Add Tags...";
      }
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

const sortableInstrumentList = Sortable.create(instrumentNotesContainer);

function saveInstrumentListener(newInstrument) {
  if (newInstrument) {
    newInstrument.addEventListener("focusout", () => {
      saveCurrentSong();
    });
  } else {
    instrumentTextArea = document.getElementsByClassName("instrument");
    for (let i = 0; i < instrumentTextArea.length; i++) {
      instrumentTextArea[i].addEventListener("focusout", () => {
        saveCurrentSong();
      });
    }
  }
}

// Creates instrument div and adds eventlistener
function createNewInstrument(newInstrument) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("instrument-container");
  newDiv.setAttribute("id", `${newInstrument}-container`);
  const newLabel = document.createElement("input");
  newLabel.value = newInstrument;
  newLabel.setAttribute("id", `${newInstrument}-label`);
  newLabel.addEventListener("blur", () => {
    currentVersion[newInstrument] = {
      instrument: newInstrument,
      notes: newTextArea.value,
      label: newLabel.value,
    };
  });
  const newCross = document.createElement("img");
  newCross.setAttribute("src", "./SVG/cross.svg");
  newCross.addEventListener("click", () => {
    SongAppInstruments.deleteInstrument(newInstrument);
  });
  const labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container");
  labelContainer.appendChild(newLabel);
  labelContainer.appendChild(newCross);
  newDiv.appendChild(labelContainer);
  const newTextArea = document.createElement("textarea");
  newTextArea.setAttribute("id", newInstrument);
  newTextArea.setAttribute("class", "instrument");
  newTextArea.setAttribute("rows", "5");
  newTextArea.setAttribute("placeholder", "Enter notes here...");
  newTextArea.addEventListener("blur", () => {
    currentVersion[newInstrument] = {
      instrument: newInstrument,
      notes: newTextArea.value,
      label: newLabel.value,
    };
  });
  newDiv.appendChild(newTextArea);

  instrumentNotesContainer.appendChild(newDiv);

  if (newInstrument === "Guitar") {
    const newGuitarTab = document.createElement("div");
    newGuitarTab.classList.add("guitar-tab");
    const newContainer = document.createElement("div");
    newContainer.classList.add("guitar-container");
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("guitar-button-container");
    const addRowBtn = document.createElement("button");
    addRowBtn.innerText = "Add Row";
    addRowBtn.id = "guitar-add";
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.id = "guitar-clear";
    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "Download";
    downloadBtn.id = "guitar-download";
    buttonContainer.appendChild(addRowBtn);
    buttonContainer.appendChild(clearBtn);
    buttonContainer.appendChild(downloadBtn);
    newContainer.appendChild(newTextArea);
    newContainer.appendChild(buttonContainer);
    newContainer.appendChild(newGuitarTab);
    newDiv.appendChild(newContainer);
    if (currentSong[currentVersion.version].Guitar) {
      if (currentSong[currentVersion.version].Guitar.tabs) {
        SongAppInstruments.addGuitarRow(
          currentSong[currentVersion.version].Guitar.tabs
        );
      }
    } else {
      SongAppInstruments.addGuitarRow();
    }

    document
      .querySelector("#guitar-add")
      .addEventListener("click", (e) => SongAppInstruments.addGuitarRow());
    document
      .querySelector("#guitar-clear")
      .addEventListener("click", (e) => SongAppInstruments.clearGuitarTab());
    document
      .querySelector("#guitar-download")
      .addEventListener("click", (e) => SongAppInstruments.downloadGuitarTab());
  }

  if (newInstrument === "Bass") {
    const newBassTab = document.createElement("div");
    newBassTab.classList.add("bass-tab");
    const newContainer = document.createElement("div");
    newContainer.classList.add("bass-container");
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("bass-button-container");
    const addRowBtn = document.createElement("button");
    addRowBtn.innerText = "Add Row";
    addRowBtn.id = "bass-add";
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.id = "bass-clear";
    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "Download";
    downloadBtn.id = "bass-download";
    buttonContainer.appendChild(addRowBtn);
    buttonContainer.appendChild(clearBtn);
    buttonContainer.appendChild(downloadBtn);
    newContainer.appendChild(newTextArea);
    newContainer.appendChild(buttonContainer);
    newContainer.appendChild(newBassTab);
    newDiv.appendChild(newContainer);
    if (currentSong[currentVersion.version].Bass) {
      if (currentSong[currentVersion.version].Bass.tabs) {
        SongAppInstruments.addBassRow(
          currentSong[currentVersion.version].Bass.tabs
        );
      }
    } else {
      SongAppInstruments.addBassRow();
    }

    document
      .querySelector("#bass-add")
      .addEventListener("click", (e) => SongAppInstruments.addBassRow());
    document
      .querySelector("#bass-clear")
      .addEventListener("click", (e) => SongAppInstruments.clearBassTab());
    document
      .querySelector("#bass-download")
      .addEventListener("click", (e) => SongAppInstruments.downloadBassTab());
  }

  if (newInstrument === "Vocals") {
    const newLyrics = document.createElement("textarea");
    newLyrics.setAttribute("id", "lyrics");
    newLyrics.setAttribute("class", "instrument");
    newLyrics.setAttribute("rows", "5");
    newLyrics.setAttribute("placeholder", "Enter lyrics here...");
    if (currentSong[currentVersion.version].Vocals) {
      if (currentSong[currentVersion.version].Vocals.lyrics) {
        newLyrics.value = currentSong[currentVersion.version].Vocals.lyrics;
      }
    }
    newLyrics.addEventListener("focusout", () => {
      currentVersion[newInstrument].lyrics = newLyrics.value;
    });
    newDiv.appendChild(newLyrics);
  }

  saveInstrumentListener(newDiv);
  currentVersion[newInstrument] = {
    instrument: newInstrument,
    notes: newTextArea.value,
    label: newLabel.value,
  };
  saveCurrentSong();
}

function rebuildInstrument(newInstrument) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("instrument-container");
  newDiv.setAttribute("id", `${newInstrument}-container`);
  const newLabel = document.createElement("input");
  newLabel.value = newInstrument;
  newLabel.setAttribute("id", `${newInstrument}-label`);
  newLabel.addEventListener("blur", () => {
    currentVersion[newInstrument] = {
      instrument: newInstrument,
      notes: newTextArea.value,
      label: newLabel.value,
    };
  });
  newLabel.addEventListener("keypress", () => {
    if (event.key == "Enter") {
      event.preventDefault();
      newLabel.blur();
      currentVersion[newInstrument] = {
        instrument: newInstrument,
        notes: newTextArea.value,
        label: newLabel.value,
      };
    }
  });
  const newCross = document.createElement("img");
  newCross.setAttribute("src", "./SVG/cross.svg");
  newCross.addEventListener("click", () => {
    SongAppInstruments.deleteInstrument(newInstrument);
  });
  const labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container");
  labelContainer.appendChild(newLabel);
  labelContainer.appendChild(newCross);
  newDiv.appendChild(labelContainer);
  const newTextArea = document.createElement("textarea");
  newTextArea.setAttribute("id", newInstrument);
  newTextArea.setAttribute("class", "instrument");
  newTextArea.setAttribute("rows", "5");
  newTextArea.setAttribute("placeholder", "Enter notes here...");
  newTextArea.addEventListener("blur", () => {
    currentVersion[newInstrument] = {
      instrument: newInstrument,
      notes: newTextArea.value,
      label: newLabel.value,
    };
  });
  newDiv.appendChild(newTextArea);

  instrumentNotesContainer.appendChild(newDiv);

  if (newInstrument === "Guitar") {
    const newGuitarTab = document.createElement("div");
    newGuitarTab.classList.add("guitar-tab");
    const newContainer = document.createElement("div");
    newContainer.classList.add("guitar-container");
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("guitar-button-container");
    const addRowBtn = document.createElement("button");
    addRowBtn.innerText = "Add Row";
    addRowBtn.id = "guitar-add";
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.id = "guitar-clear";
    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "Download";
    downloadBtn.id = "guitar-download";
    buttonContainer.appendChild(addRowBtn);
    buttonContainer.appendChild(clearBtn);
    buttonContainer.appendChild(downloadBtn);
    newContainer.appendChild(newTextArea);
    newContainer.appendChild(buttonContainer);
    newContainer.appendChild(newGuitarTab);
    newDiv.appendChild(newContainer);
    if (currentSong[currentVersion.version].Guitar) {
      if (currentSong[currentVersion.version].Guitar.tabs) {
        SongAppInstruments.addGuitarRow(
          currentSong[currentVersion.version].Guitar.tabs
        );
      }
    } else {
      SongAppInstruments.addGuitarRow();
    }

    document
      .querySelector("#guitar-add")
      .addEventListener("click", (e) => SongAppInstruments.addGuitarRow());
    document
      .querySelector("#guitar-clear")
      .addEventListener("click", (e) => SongAppInstruments.clearGuitarTab());
    document
      .querySelector("#guitar-download")
      .addEventListener("click", (e) => SongAppInstruments.downloadGuitarTab());
  }

  if (newInstrument === "Bass") {
    const newBassTab = document.createElement("div");
    newBassTab.classList.add("bass-tab");
    const newContainer = document.createElement("div");
    newContainer.classList.add("bass-container");
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("bass-button-container");
    const addRowBtn = document.createElement("button");
    addRowBtn.innerText = "Add Row";
    addRowBtn.id = "bass-add";
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.id = "bass-clear";
    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "Download";
    downloadBtn.id = "bass-download";
    buttonContainer.appendChild(addRowBtn);
    buttonContainer.appendChild(clearBtn);
    buttonContainer.appendChild(downloadBtn);
    newContainer.appendChild(newTextArea);
    newContainer.appendChild(buttonContainer);
    newContainer.appendChild(newBassTab);
    newDiv.appendChild(newContainer);
    if (currentSong[currentVersion.version].Bass) {
      if (currentSong[currentVersion.version].Bass.tabs) {
        SongAppInstruments.addBassRow(
          currentSong[currentVersion.version].Bass.tabs
        );
      }
    } else {
      SongAppInstruments.addBassRow();
    }

    document
      .querySelector("#bass-add")
      .addEventListener("click", (e) => SongAppInstruments.addBassRow());
    document
      .querySelector("#bass-clear")
      .addEventListener("click", (e) => SongAppInstruments.clearBassTab());
    document
      .querySelector("#bass-download")
      .addEventListener("click", (e) => SongAppInstruments.downloadBassTab());
  }

  if (newInstrument === "Vocals") {
    const newLyrics = document.createElement("textarea");
    newLyrics.setAttribute("id", "lyrics");
    newLyrics.setAttribute("class", "instrument");
    newLyrics.setAttribute("rows", "5");
    newLyrics.setAttribute("placeholder", "Enter lyrics here...");
    if (currentSong[currentVersion.version].Vocals) {
      if (currentSong[currentVersion.version].Vocals.lyrics) {
        newLyrics.value = currentSong[currentVersion.version].Vocals.lyrics;
      }
    }
    newLyrics.addEventListener("focusout", () => {
      currentVersion[newInstrument].lyrics = newLyrics.value;
    });
    newDiv.appendChild(newLyrics);
  }

  saveInstrumentListener(newDiv);
}

function addInstrumentInputListeners() {
  instrumentAddButton.addEventListener("click", () => {
    addInstrument();
  });
  instrumentInput.addEventListener("keypress", () => {
    if (event.key === "Enter") {
      event.preventDefault();
      instrumentAddButton.click();
    }
  });
}

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

  currentSong[currentVersion.version] = currentVersion;

  console.log(currentVersion);
  console.log(currentSong);

  // Save current guitar tabs, if it exists
  if (currentSong[currentVersion.version].Guitar) {
    const guitarTab = document.querySelector(".guitar-tab");
    currentSong[currentVersion.version].Guitar.tabs = guitarTab.innerText;
  }

  // Save current bass tabs, if it exists
  if (currentSong[currentVersion.version].Bass) {
    const bassTab = document.querySelector(".bass-tab");
    currentSong[currentVersion.version].Bass.tabs = bassTab.innerText;
  }

  // Save current lyrics, if it exists
  if (currentSong[currentVersion.version].Vocals) {
    const lyrics = document.getElementById("lyrics");
    currentSong[currentVersion.version].Vocals.lyrics = lyrics.value;
  }

  // Set default title if there is not one set
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
  window.scrollTo(0, 0);
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
  // Add Mobile View Listeners
  SongAppMobile.addMobileListeners();

  // Build song list and select most recent song
  SongAppSidebar.createSongList();
  SongAppSidebar.addSongListeners();
  SongAppSidebar.selectMostRecentSong();

  // Add version button listener
  SongAppVersions.addVersionButtonListener();

  // Add download / upload listeners
  SongAppImportExport.exportCopy();
  SongAppImportExport.importCopy();

  SongAppSettings.addPrefBtnListener();
  addSongTitleListeners();
  addTagButtonListeners();
  SongAppTheme.addBlobListeners();
  addInstrumentInputListeners();
  SongAppSidebar.addNewNoteListener();
  SongAppSidebar.addInfoListener();
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
          rebuildInstrument(instrumentName);
          const instrumentNotes = document.getElementById(instrumentName);
          instrumentNotes.value = songObject[keys][instruments].notes;
          const instrumentLabel = document.getElementById(
            `${instrumentName}-label`
          );
          instrumentLabel.value = songObject[keys][instruments].label;
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
  SongAppTags.checkTagContainerGap();
}

// Clear Song from DOM
export function clearSong() {
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
