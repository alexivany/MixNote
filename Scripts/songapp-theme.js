"use strict";

import {
  currentSong,
  saveCurrentSong,
  loadVersion,
  currentVersion,
  clearVersion,
} from "./main.js";

export default class SongAppTheme {
  static addBlobListeners() {
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
            activeTab.style.color = "#ef4444";
            break;
          case "orange-blob":
            currentVersion.color = "#f97316";
            activeTab.style.borderColor = "#f97316";
            activeTab.style.color = "#f97316";
            break;
          case "yellow-blob":
            currentVersion.color = "#facc15";
            activeTab.style.borderColor = "#facc15";
            activeTab.style.color = "#facc15";
            break;
          case "green-blob":
            currentVersion.color = "#22c55e";
            activeTab.style.borderColor = "#22c55e";
            activeTab.style.color = "#22c55e";
            break;
          case "teal-blob":
            currentVersion.color = "#14b8a6";
            activeTab.style.borderColor = "#14b8a6";
            activeTab.style.color = "#14b8a6";
            break;
          case "cyan-blob":
            currentVersion.color = "#06b6d4";
            activeTab.style.borderColor = "#06b6d4";
            activeTab.style.color = "#06b6d4";
            break;
          case "blue-blob":
            currentVersion.color = "#3b82f6";
            activeTab.style.borderColor = "#3b82f6";
            activeTab.style.color = "#3b82f6";
            break;
          case "purple-blob":
            currentVersion.color = "#a855f7";
            activeTab.style.borderColor = "#a855f7";
            activeTab.style.color = "#a855f7";
            break;
          case "pink-blob":
            currentVersion.color = "#ec4899";
            activeTab.style.borderColor = "#ec4899";
            activeTab.style.color = "#ec4899";
            break;
          case "grey-blob":
            currentVersion.color = "#eef1f4";
            activeTab.style.borderColor = "#eef1f4";
            const body = document.body;
            const compStyle = window.getComputedStyle(body);
            if (
              compStyle.getPropertyValue("background-color") ===
              "rgb(34, 34, 35)"
            ) {
              activeTab.style.color = "#fffff";
            } else {
              activeTab.style.color = "#000000";
            }
            break;
        }
        const currentVersionTitle =
          document.querySelector(".tab-active").innerText;

        saveCurrentSong();
        const instrumentNotesContainer =
          document.querySelector(".instrument-notes");
        for (let i = 0; i < instrumentNotesContainer.childElementCount; i++) {
          instrumentNotesContainer.removeChild(
            instrumentNotesContainer.firstChild
          );
        }
        while (
          instrumentNotesContainer.firstChild &&
          instrumentNotesContainer.removeChild(
            instrumentNotesContainer.firstChild
          )
        );
        loadVersion(currentVersionTitle);
      });
    }
  }
}
