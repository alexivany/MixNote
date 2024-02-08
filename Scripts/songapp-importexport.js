"use strict";
import SongAppStorage from "./songapp-storage.js";
import { currentSong, loadSong, saveCurrentSong } from "./main.js";

export default class SongAppImportExport {
  // Download a copy of currentSong in JSON format
  static exportCopy() {
    const downloadButton = document.getElementById("download-button");
    downloadButton.addEventListener("click", () => {
      const filename = `${currentSong.title}.json`;
      const jsonStr = SongAppStorage.retrieveSongJSON(currentSong);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      downloadButton.href = url;
      downloadButton.download = filename;
    });
  }

  // Upload a JSON containing new song object, load then save
  static importCopy() {
    const fileUpload = document.getElementById("file-upload");
    fileUpload.addEventListener("change", () => {
      const url = URL.createObjectURL(fileUpload.files[0]);

      const reader = new FileReader();

      reader.readAsText(fileUpload.files[0]);

      reader.addEventListener("load", () => {
        loadSong(JSON.parse(reader.result));
        saveCurrentSong();
      });
    });
  }
}
