"use strict";

import { songAppList, loadSong, currentSong, deleteSelectedSong } from "./main.js";
import SongAppVersions from "./songapp-versions.js";
import SongAppStorage from "./songapp-storage.js";
import SongAppTags from "./songapp-tags.js";

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
      songButtons[i].addEventListener("dblclick", () => {
        deleteSelectedSong();
      })
    }
  }
  
  // Default song sidebar selection, load most recent song or create a new one if none exist
  static selectMostRecentSong() {
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
}
