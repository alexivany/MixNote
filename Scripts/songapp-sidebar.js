"use strict";

import {
  songAppList,
  loadSong,
  currentSong,
  deleteSelectedSong,
  clearSong,
} from "./main.js";
import SongAppVersions from "./songapp-versions.js";
import SongAppStorage from "./songapp-storage.js";
import SongAppTags from "./songapp-tags.js";

const removeInfoModal = (e) => {
  const infoModal = document.querySelector(".info-modal");
  if (infoModal !== e.target && !infoModal.contains(e.target)) {
    infoModal.remove();
    document.getElementById("song-app").style.opacity = "1";
    document.removeEventListener("click", removeInfoModal);
  }
};

export default class SongAppSidebar {
  // Create & insert a new sidebar button for each song saved in local storage
  static createSongList() {
    songAppList.forEach((song) => {
      const currentList = document.querySelector(".content-navbar");
      const sidebar = document.querySelector(".content-navbar");
      const songTitle = song.title;
      const newSongButton = document.createElement("button");
      const newSongTitle = document.createTextNode(`${songTitle}`);
      newSongButton.classList.add("song-navbar");
      newSongButton.appendChild(newSongTitle);
      sidebar.appendChild(newSongButton);
    });
  }

  // Clear Song List
  static clearSongList() {
    if (document.querySelector(".tag-search")) {
      SongAppTags.removeSearchedTag();
    }
    const currentList = document.querySelector(".content-navbar");
    const songButtons = document.querySelectorAll(".song-navbar");
    songButtons.forEach((button) => {
      button.remove();
    });
  }

  // Selection of songs in the sidebar
  static addSongListeners() {
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

          if (document.getElementById("sidebar-cross")) {
            document.getElementById("sidebar-cross").remove();
          }

          const newCrossElement = document.createElement("img");
          newCrossElement.src = "./SVG/cross.svg";
          newCrossElement.id = "sidebar-cross";
          songButtons[i].appendChild(newCrossElement);
          newCrossElement.addEventListener("click", () => {
            setTimeout(() => {
              deleteSelectedSong();
            }, 1);
          });
        }
        // Check if there is a match in local storage
        const songName = songButtons[i].innerText;
        const existingTitle = songAppList.find(
          (song) => song.title == songName
        );
        if (existingTitle) {
          loadSong(existingTitle);
        }
      });
      // songButtons[i].addEventListener("dblclick", () => {
      //   deleteSelectedSong();
      // });
    }
  }

  // Default song sidebar selection, load most recent song or create a new one if none exist
  static selectMostRecentSong() {
    let songButtons = document.getElementsByClassName("song-navbar");
    if (songButtons.length >= 1) {
      for (let i = 0; i < songButtons.length; i++) {
        songButtons[0].classList.add("active-navbar");
        if (document.getElementById("sidebar-cross")) {
          document.getElementById("sidebar-cross").remove();
        }

        const newCrossElement = document.createElement("img");
        newCrossElement.src = "./SVG/cross.svg";
        newCrossElement.id = "sidebar-cross";
        songButtons[0].appendChild(newCrossElement);
        newCrossElement.addEventListener("click", () => {
          setTimeout(() => {
            deleteSelectedSong();
          }, 1);
        });
      }
      // Check if there is a match in local storage
      const songName = songButtons[0].innerText;
      const existingTitle = songAppList.find((song) => song.title == songName);
      if (existingTitle) {
        loadSong(existingTitle);
      }
    } else {
      SongAppVersions.createDefaultVersion();
    }
  }

  // Default Song Selection
  static selectDefaultSong() {
    let songButtons = document.getElementsByClassName("song-navbar");
    for (let i = 0; i < songButtons.length; i++) {
      songButtons[0].classList.add("active-navbar");
    }
  }

  // Create new default note
  static addNewNoteListener() {
    const newNoteButton = document.querySelector(".new-note-navbar");
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
  }

  static addInfoListener() {
    const infoButton = document.querySelector(".info-navbar");
    infoButton.addEventListener("click", () => {
      SongAppSidebar.createInfoModal();
    });
  }
  // <div class="title-navbar">
  // <h1>MixNote</h1>
  // <div class="icon-navbar-container">
  //   <img src="./SVG/music-slider.svg" alt="" />
  //   <img src="./SVG/hamburger.svg" class="hamburger-menu" alt="" />
  // </div>

  static createInfoModal() {
    window.scrollTo(0, 0);
    const infoModal = document.createElement("div");
    infoModal.classList.add("info-modal");
    const infoModalTitle = document.createElement("h1");
    infoModalTitle.innerText = "MixNote";
    infoModalTitle.classList.add("info-modal-title");
    const infoModalText = document.createElement("p");
    infoModalText.innerText =
      "MixNote is a note taking app made for audio engineers, mixing assistants and recording artists everywhere. Write notes with songs broken down into multiple versions, keeping track of all your mixing notes throughout a song's life. Easily transfer between devices with the download / upload feature, and take advantage of built-in guitar & bass tablature, for memorizing any sections that might need to be recorded or overdubbed.";
    const infoModalContact = document.createElement("p");
    infoModalContact.innerText = `Contact with any concerns or comments:
    ivany.world@gmail.com`;
    const infoModalOkBtn = document.createElement("button");
    infoModalOkBtn.innerText = "OK";
    const infoModalArrow = document.createElement("img");
    infoModalArrow.classList.add("info-arrow-right");
    infoModalArrow.src = "./SVG/arrow-right.svg";
    const infoModalCircle1 = document.createElement("div");
    infoModalCircle1.classList.add("info-circle");
    infoModalCircle1.classList.add("info-circle-filled");
    const infoModalCircle2 = document.createElement("div");
    infoModalCircle2.classList.add("info-circle");
    const infoModalCircle3 = document.createElement("div");
    infoModalCircle3.classList.add("info-circle");
    const infoModalCircleContainer = document.createElement("div");
    const infoModalArrowLeft = document.createElement("img");
    infoModalArrowLeft.classList.add("info-arrow-left");
    infoModalArrowLeft.src = "./SVG/arrow-left.svg";
    infoModalArrowLeft.style.display = "none";
    infoModalCircleContainer.classList.add("info-circle-container");
    infoModalCircleContainer.appendChild(infoModalCircle1);
    infoModalCircleContainer.appendChild(infoModalCircle2);
    infoModalCircleContainer.appendChild(infoModalCircle3);
    infoModal.appendChild(infoModalTitle);
    infoModal.appendChild(infoModalText);
    infoModal.appendChild(infoModalContact);
    infoModal.appendChild(infoModalOkBtn);
    infoModal.appendChild(infoModalArrow);
    infoModal.appendChild(infoModalArrowLeft);
    infoModal.appendChild(infoModalCircleContainer);
    document.querySelector("body").appendChild(infoModal);

    document.getElementById("song-app").style.opacity = "0.25";

    setTimeout(() => {
      document.addEventListener("click", removeInfoModal);
    }, 200);

    infoModalOkBtn.addEventListener("click", () => {
      infoModal.remove();
      document.removeEventListener("click", removeInfoModal);
      document.getElementById("song-app").style.opacity = "1";
    });

    infoModalArrow.addEventListener("click", () => {
      if (infoModalCircle1.classList.contains("info-circle-filled")) {
        document.querySelector(".info-modal-title").remove();
        infoModalArrowLeft.style.display = "inline";
        const versionTutImg = document.createElement("img");
        if (
          window
            .getComputedStyle(document.body)
            .getPropertyValue("background-color") === "rgba(0, 0, 0, 0)"
        ) {
          versionTutImg.src = "./Github-src/VersionTut.png";
        } else {
          versionTutImg.src = "./Github-src/VersionTutDark.png";
        }
        versionTutImg.classList.add("tutorial-image");
        infoModal.prepend(versionTutImg);
        infoModalText.innerText =
          "Add different versions of your song by clicking the Add Version Button, then easily switch between them using the version tabs.";
        infoModalContact.innerText = "";
        infoModalCircle1.classList.remove("info-circle-filled");
        infoModalCircle2.classList.add("info-circle-filled");
      } else if (infoModalCircle2.classList.contains("info-circle-filled")) {
        infoModalArrow.style.display = "none";
        infoModalArrowLeft.style.display = "inline";
        document.querySelector(".tutorial-image").remove();
        const versionTutImg = document.createElement("img");
        if (
          window
            .getComputedStyle(document.body)
            .getPropertyValue("background-color") === "rgba(0, 0, 0, 0)"
        ) {
          versionTutImg.src = "./Github-src/InstrumentTut.png";
        } else {
          versionTutImg.src = "./Github-src/InstrumentTutDark.png";
        }
        versionTutImg.classList.add("tutorial-image");
        infoModalText.innerText =
          "Add pre-built instruments using the drop-down list, or create custom instruments by typing them in.";
        infoModal.prepend(versionTutImg);
        infoModalCircle2.classList.remove("info-circle-filled");
        infoModalCircle3.classList.add("info-circle-filled");
      }
    });

    infoModalArrowLeft.addEventListener("click", () => {
      if (infoModalCircle3.classList.contains("info-circle-filled")) {
        infoModalArrow.style.display = "inline";
        infoModalArrowLeft.style.display = "inline";
        document.querySelector(".tutorial-image").remove();
        const versionTutImg = document.createElement("img");
        if (
          window
            .getComputedStyle(document.body)
            .getPropertyValue("background-color") === "rgba(0, 0, 0, 0)"
        ) {
          versionTutImg.src = "./Github-src/VersionTut.png";
        } else {
          versionTutImg.src = "./Github-src/VersionTutDark.png";
        }
        versionTutImg.classList.add("tutorial-image");
        infoModal.prepend(versionTutImg);
        infoModalText.innerText =
          "Add different versions of your song by clicking the Add Version Button, then easily switch between them using the version tabs.";
        infoModalContact.innerText = "";
        infoModalCircle3.classList.remove("info-circle-filled");
        infoModalCircle2.classList.add("info-circle-filled");
      } else if (infoModalCircle2.classList.contains("info-circle-filled")) {
        document.querySelector(".tutorial-image").remove();
        const infoModalTitle = document.createElement("h1");
        infoModalTitle.innerText = "MixNote";
        infoModalTitle.classList.add("info-modal-title");
        infoModalArrow.style.display = "inline";
        infoModalArrowLeft.style.display = "none";
        infoModalText.innerText =
          "SongNote is a note taking app made for audio engineers, mixing assistants and recording artists everywhere. Write notes with songs broken down into multiple versions, keeping track of all your mixing notes throughout a song's life. Easily transfer between devices with the download / upload feature, and take advantage of built-in guitar & bass tablature, for memorizing any sections that might need to be recorded or overdubbed.";
        infoModalContact.innerText = `Contact with any concerns or comments:
        ivany.world@gmail.com`;
        infoModalCircle2.classList.remove("info-circle-filled");
        infoModalCircle1.classList.add("info-circle-filled");
        infoModal.prepend(infoModalTitle);
      }
    });
  }
}
