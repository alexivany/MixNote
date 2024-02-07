"use strict";

export default class SongAppStorage {
  static getAllSongs() {
    const songs = JSON.parse(localStorage.getItem("songapp-songs") || "[]");

    // Sorting algorithm, by most recently updated
    return songs.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }
  static saveSong(songToSave) {
    const songs = SongAppStorage.getAllSongs();
    const existing = songs.find((song) => song.id == songToSave.id);

    // Update matching ID
    if (existing) {
      existing.title = songToSave.title;
      existing.updated = new Date().toISOString();
      let existingIndex = songs.findIndex((song) => song.id == songToSave.id);
      songs.splice(existingIndex, 1);
      songs.push(songToSave);
    } else {
      // Generate random ID
      songToSave.id = Math.floor(Math.random() * 1000000);
      songToSave.updated = new Date().toISOString();
      songs.push(songToSave);
    }

    localStorage.setItem("songapp-songs", JSON.stringify(songs));
  }
  static deleteSong(id) {
    const songs = SongAppStorage.getAllSongs();
    const newSongs = songs.filter((song) => song.id != id);

    localStorage.setItem("songapp-songs", JSON.stringify(newSongs));
  }

  static retrieveSongJSON(songToFind) {
    const songs = SongAppStorage.getAllSongs();
    const existing = songs.find((song) => song.id == songToFind.id);

    if (existing) {
      return JSON.stringify(existing);
    }
  }
}
