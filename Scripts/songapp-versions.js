"use strict";

import {
  addVersionButton,
  tabContainer,
  currentSong,
  currentVersion,
  updateLocalTime,
  saveCurrentSong,
  clearVersion,
  loadVersion,
  loadSong,
} from "./main.js";

let versionsCollection = document.getElementsByClassName("tab-header");
let versionsArray = Array.from(versionsCollection);
let currentVersionButton = document.querySelector(".tab-active");

export default class SongAppVersions {
  // Default version display
  static createDefaultVersion() {
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

  // Add up to a maximum of 9 versions
  static addVersionButtonListener() {
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
          SongAppVersions.activeTabSelection(newVersion);

          clearVersion();
          currentVersionButton = document.querySelector(".tab-active");
          currentVersion.version = currentVersionButton.innerText;
          loadVersion(currentVersion.version);
          saveCurrentSong();
        }
      } else {
        return;
      }
    });
  }

  // Switching of the active tab
  static activeTabSelection(newVersion) {
    versionsArray = Array.from(versionsCollection);

    if (newVersion) {
      for (let i = 0; i < versionsArray.length; i++) {
        versionsArray[i].classList.remove("tab-active");
      }
      newVersion.classList.add("tab-active");
      newVersion.addEventListener("click", () => {
        for (let i = 0; i < 1; i++) {
          if (newVersion.classList.contains("tab-active")) {
            return;
          } else {
            for (let i = 0; i < versionsArray.length; i++) {
              versionsArray[i].classList.remove("tab-active");
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
        SongAppVersions.deleteVersion(currentVersion.version);
        saveCurrentSong();
      });
    } else {
      for (let i = 0; i < versionsArray.length; i++) {
        versionsArray[i].addEventListener("click", () => {
          if (versionsArray[i].classList.contains("tab-active")) {
            return;
          } else {
            for (let i = 0; i < versionsArray.length; i++) {
              versionsArray[i].classList.remove("tab-active");
            }
            versionsArray[i].classList.add("tab-active");
          }

          clearVersion();
          currentVersionButton = document.querySelector(".tab-active");
          currentVersion.version = currentVersionButton.innerText;
          loadVersion(currentVersion.version);
        });
        versionsArray[i].addEventListener("dblclick", () => {
          SongAppVersions.deleteVersion(currentVersion.version);
          saveCurrentSong();
        });
      }
    }
  }

  // Create delete modal pop-up
  static deleteVersion(versionToDelete) {
    const versionModal = document.createElement("div");
    versionModal.classList.add("delete-modal");
    const versionModalText = document.createElement("p");
    versionModalText.innerText = "Delete version?";
    const versionModalBtnDiv = document.createElement("div");
    const versionModalYes = document.createElement("button");
    versionModalYes.innerText = "Yes";
    const versionModalNo = document.createElement("button");
    versionModalNo.innerText = "No";
    versionModal.appendChild(versionModalText);
    versionModalBtnDiv.appendChild(versionModalYes);
    versionModalBtnDiv.appendChild(versionModalNo);
    versionModal.appendChild(versionModalBtnDiv);
    document.querySelector("body").appendChild(versionModal);

    versionModalYes.addEventListener("click", () => {
      delete currentSong[versionToDelete];

      const tabToDelete = document.querySelector(".tab-active");
      tabToDelete.remove();

      clearVersion();
      let defaultVersion = tabContainer.firstElementChild.innerText;
      loadVersion(defaultVersion);

      loadSong(currentSong);
      versionModal.remove();
    });

    versionModalNo.addEventListener("click", () => {
      versionModal.remove();
    });
  }
}
