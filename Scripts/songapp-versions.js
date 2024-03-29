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

// Remove delete version modal on outside click
const removeModal = (e) => {
  const versionModal = document.querySelector(".delete-modal");
  if (versionModal !== e.target && !versionModal.contains(e.target)) {
    document.getElementById("song-app").style.opacity = "1";
    versionModal.remove();
    document.removeEventListener("click", removeModal);
  }
};

export default class SongAppVersions {
  // Default version display
  static createDefaultVersion() {
    if (versionsCollection.length == 0) {
      const newVersion = document.createElement("button");
      const newVersionName = "Demo";
      newVersion.innerText = newVersionName;
      newVersion.classList.add("tab-header");
      newVersion.addEventListener("click", SongAppVersions.activeTabSelection);
      addVersionButton.before(newVersion);
      tabContainer.firstElementChild.classList.add("tab-active");
      currentVersionButton = document.querySelector(".tab-active");
      currentVersion.version = currentVersionButton.innerText;
      currentVersion.color = "#eef1f4";
      currentSong[currentVersion.version] = currentVersion;
    }
  }

  // Add up to a maximum of 9 versions
  static addVersionButtonListener() {
    addVersionButton.addEventListener("click", () => {
      if (versionsCollection.length < 9) {
        SongAppVersions.newVersionModal();
      } else {
        SongAppVersions.newVersionWarningModal();
      }
    });
  }

  // Modal for adding a new version
  static newVersionModal() {
    window.scrollTo(0, 0);
    const versionModal = document.createElement("div");
    versionModal.classList.add("delete-modal");
    const versionModalText = document.createElement("p");
    versionModalText.innerText = "Enter new version name";
    const versionModalInput = document.createElement("input");
    const versionModalBtnDiv = document.createElement("div");
    const versionModalOk = document.createElement("button");
    versionModalOk.innerText = "OK";
    const versionModalCancel = document.createElement("button");
    versionModalCancel.innerText = "Cancel";
    versionModal.appendChild(versionModalText);
    versionModal.appendChild(versionModalInput);
    versionModalBtnDiv.appendChild(versionModalOk);
    versionModalBtnDiv.appendChild(versionModalCancel);
    versionModal.appendChild(versionModalBtnDiv);
    document.querySelector("body").appendChild(versionModal);

    document.getElementById("song-app").style.opacity = "0.25";

    versionModalOk.addEventListener("click", () => {
      const newVersionName = versionModalInput.value;
      if (newVersionName === "") {
        versionModal.remove();
      } else if (newVersionName === null) {
        versionModal.remove();
      } else {
        const newVersion = document.createElement("button");
        newVersion.innerText = newVersionName;
        newVersion.classList.add("tab-header");
        addVersionButton.before(newVersion);
        updateLocalTime();
        SongAppVersions.activeTabSelection(newVersion);

        if (document.getElementById("version-cross")) {
          document.getElementById("version-cross").remove();
        }

        clearVersion();
        currentVersionButton = document.querySelector(".tab-active");
        currentVersion.version = currentVersionButton.innerText;
        loadVersion(currentVersion.version);
        saveCurrentSong();

        const newCrossElement = document.createElement("img");
        newCrossElement.src = "./SVG/cross.svg";
        newCrossElement.id = "version-cross";
        newVersion.appendChild(newCrossElement);
      }
      document.getElementById("song-app").style.opacity = "1";
      versionModal.remove();
    });

    versionModalCancel.addEventListener("click", () => {
      document.getElementById("song-app").style.opacity = "1";
      versionModal.remove();
    });

    versionModalInput.addEventListener("keypress", () => {
      if (event.key === "Enter") {
        event.preventDefault();
        versionModalOk.click();
      }
    });
  }

  // Warning for max versions reached
  static newVersionWarningModal() {
    window.scrollTo(0, 0);
    const versionModal = document.createElement("div");
    versionModal.classList.add("delete-modal");
    const versionModalText = document.createElement("p");
    versionModalText.innerText = "You have added the max amount of versions!";
    const versionModalBtnDiv = document.createElement("div");
    const versionModalOk = document.createElement("button");
    versionModalOk.innerText = "OK";
    versionModal.appendChild(versionModalText);
    versionModalBtnDiv.appendChild(versionModalOk);
    versionModal.appendChild(versionModalBtnDiv);
    document.querySelector("body").appendChild(versionModal);

    document.getElementById("song-app").style.opacity = "0.25";

    versionModalOk.addEventListener("click", () => {
      document.getElementById("song-app").style.opacity = "1";
      versionModal.remove();
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
      newVersion.style.removeProperty("background-color");
      newVersion.addEventListener("click", () => {
        for (let i = 0; i < 1; i++) {
          if (newVersion.classList.contains("tab-active")) {
            return;
          } else {
            for (let i = 0; i < versionsArray.length; i++) {
              versionsArray[i].classList.remove("tab-active");
              if (
                window
                  .getComputedStyle(versionsArray[i])
                  .getPropertyValue("border-color") === "rgb(197, 197, 197)" ||
                window
                  .getComputedStyle(versionsArray[i])
                  .getPropertyValue("border-color") === "rgb(238, 241, 244)"
              ) {
                versionsArray[i].style.backgroundColor = "rgb(238, 241, 244)";
                versionsArray[i].style.color = "#000000";
                versionsArray[i].style.borderColor = "rgb(238, 241, 244)";
              } else {
                versionsArray[i].style.backgroundColor =
                  versionsArray[i].style.borderColor;
                versionsArray[i].style.color = "#ffffff";
              }
            }
            newVersion.classList.add("tab-active");
            newVersion.style.removeProperty("background-color");
          }

          if (document.getElementById("version-cross")) {
            document.getElementById("version-cross").remove();
          }
          clearVersion();
          currentVersionButton = document.querySelector(".tab-active");
          currentVersion.version = currentVersionButton.innerText;
          loadVersion(currentVersion.version);

          const newCrossElement = document.createElement("img");
          newCrossElement.src = "./SVG/cross.svg";
          newCrossElement.id = "version-cross";
          newVersion.appendChild(newCrossElement);
          newCrossElement.addEventListener("click", () => {
            setTimeout(() => {
              SongAppVersions.deleteVersion(currentVersion.version);
            }, 1);
            saveCurrentSong();
          });
        }
      });
    } else {
      for (let i = 0; i < versionsArray.length; i++) {
        versionsArray[i].addEventListener("click", () => {
          if (versionsArray[i].classList.contains("tab-active")) {
            return;
          } else {
            for (let i = 0; i < versionsArray.length; i++) {
              versionsArray[i].classList.remove("tab-active");
              if (
                window
                  .getComputedStyle(versionsArray[i])
                  .getPropertyValue("border-color") === "rgb(197, 197, 197)" ||
                window
                  .getComputedStyle(versionsArray[i])
                  .getPropertyValue("border-color") === "rgb(238, 241, 244)"
              ) {
                versionsArray[i].style.backgroundColor = "rgb(238, 241, 244)";
                versionsArray[i].style.color = "#000000";
                versionsArray[i].style.borderColor = "rgb(238, 241, 244)";
              } else {
                versionsArray[i].style.backgroundColor =
                  versionsArray[i].style.borderColor;
                versionsArray[i].style.color = "#ffffff";
              }
            }
            versionsArray[i].classList.add("tab-active");
            versionsArray[i].style.removeProperty("background-color");
            if (versionsArray[i].style.borderColor === "rgb(238, 241, 244)") {
              versionsArray[i].style.color = "#000000";
            } else if (
              versionsArray[i].style.borderColor === "rgb(197, 197, 197)"
            ) {
              versionsArray[i].style.color = "#000000";
            } else {
              versionsArray[i].style.color = versionsArray[i].style.borderColor;
            }
          }

          if (document.getElementById("version-cross")) {
            document.getElementById("version-cross").remove();
          }
          clearVersion();
          currentVersionButton = document.querySelector(".tab-active");
          currentVersion.version = currentVersionButton.innerText;
          loadVersion(currentVersion.version);

          const newCrossElement = document.createElement("img");
          newCrossElement.src = "./SVG/cross.svg";
          newCrossElement.id = "version-cross";
          versionsArray[i].appendChild(newCrossElement);
          newCrossElement.addEventListener("click", () => {
            setTimeout(() => {
              SongAppVersions.deleteVersion(currentVersion.version);
            }, 1);
            saveCurrentSong();
          });
        });
      }
    }
  }

  // Create delete modal pop-up
  static deleteVersion(versionToDelete) {
    window.scrollTo(0, 0);
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

    document.getElementById("song-app").style.opacity = "0.25";

    document.addEventListener("click", removeModal);

    versionModalYes.addEventListener("click", () => {
      delete currentSong[versionToDelete];

      const tabToDelete = document.querySelector(".tab-active");
      tabToDelete.remove();

      loadSong(currentSong);
      document.removeEventListener("click", removeModal);
      document.getElementById("song-app").style.opacity = "1";
      versionModal.remove();
    });

    versionModalNo.addEventListener("click", () => {
      document.removeEventListener("click", removeModal);
      document.getElementById("song-app").style.opacity = "1";
      versionModal.remove();
    });
  }
}
