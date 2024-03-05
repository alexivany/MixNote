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
      const sidebar = document.querySelector(".settings-navbar");
      const songTitle = song.title;
      const newSongButton = document.createElement("button");
      const newSongTitle = document.createTextNode(`${songTitle}`);
      newSongButton.classList.add("song-navbar");
      newSongButton.appendChild(newSongTitle);
      sidebar.before(newSongButton);
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

  static createInfoModal() {
    window.scrollTo(0, 0);
    const infoModal = document.createElement("div");
    infoModal.classList.add("info-modal");
    const infoModalText = document.createElement("p");
    infoModalText.innerText =
      "SongNote is a note taking app made for audio engineers, mixing assistants and recording artists everywhere. Write notes with songs broken down into multiple versions, keeping track of all your mixing notes throughout a song's life. Easily transfer between devices with the download / upload feature, and take advantage of built-in guitar & bass tablature, for memorizing any sections that might need to be recorded or overdubbed.";
    const infoModalContact = document.createElement("p");
    infoModalContact.innerText = `Contact with any concerns or comments:
    alexander.ivany@gmail.com`;
    const infoModalOkBtn = document.createElement("button");
    infoModalOkBtn.innerText = "OK";
    infoModal.appendChild(infoModalText);
    infoModal.appendChild(infoModalContact);
    infoModal.appendChild(infoModalOkBtn);
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
  }
}
