"use strict";

import { tagArray, saveCurrentSong, songAppList } from "./main.js";
import SongAppSidebar from "./songapp-sidebar.js";
import SongAppStorage from "./songapp-storage.js";

// Remove delete tag modal on outside click
const removeModal = (e) => {
  const tagModal = document.querySelector(".delete-modal");
  if (tagModal !== e.target && !tagModal.contains(e.target)) {
    tagModal.remove();
    document.getElementById("song-app").style.opacity = "1";
    document.removeEventListener("click", removeModal);
  }
};

export default class SongAppTags {
  // Create delete tag modal
  static deleteTag(tagToDelete) {
    window.scrollTo(0, 0);
    const tagModal = document.createElement("div");
    tagModal.classList.add("delete-modal");
    const tagModalText = document.createElement("p");
    tagModalText.innerText = "Delete tag?";
    const tagModalBtnDiv = document.createElement("div");
    const tagModalYes = document.createElement("button");
    tagModalYes.innerText = "Yes";
    const tagModalNo = document.createElement("button");
    tagModalNo.innerText = "No";
    tagModal.appendChild(tagModalText);
    tagModalBtnDiv.appendChild(tagModalYes);
    tagModalBtnDiv.appendChild(tagModalNo);
    tagModal.appendChild(tagModalBtnDiv);
    document.querySelector("body").appendChild(tagModal);

    document.getElementById("song-app").style.opacity = "0.25";

    document.addEventListener("click", removeModal);

    tagModalYes.addEventListener("click", () => {
      const tagToDeleteIndex = tagArray.indexOf(tagToDelete.innerText);
      tagArray.splice(tagToDeleteIndex, 1);
      tagToDelete.remove();
      document.removeEventListener("click", removeModal);
      tagModal.remove();
      document.getElementById("song-app").style.opacity = "1";
      saveCurrentSong();
      SongAppTags.removeSearchedTag();
    });

    tagModalNo.addEventListener("click", () => {
      document.removeEventListener("click", removeModal);
      document.getElementById("song-app").style.opacity = "1";
      tagModal.remove();
    });
  }

  // Add click & dblclick event listeners to all tags
  static addTagListeners(newTag) {
    const currentTags = document.getElementsByClassName("tag");
    if (newTag) {
      newTag.addEventListener("click", () => {
        const tagToFind = newTag.innerText;
        SongAppTags.searchMatchingTags(tagToFind);

        const newCrossElement = document.createElement("img");
        newCrossElement.src = "./SVG/cross.svg";
        newTag.appendChild(newCrossElement);
        newCrossElement.addEventListener("click", () => {
          setTimeout(() => {
            SongAppTags.deleteTag(newTag);
          }, 1);
        });
      });
    } else {
      for (let i = 0; i < currentTags.length; i++) {
        currentTags[i].addEventListener("click", () => {
          const tagToFind = currentTags[i].innerText;
          SongAppTags.searchMatchingTags(tagToFind);

          const newCrossElementArray = document.createElement("img");
          newCrossElementArray.src = "./SVG/cross.svg";
          currentTags[i].appendChild(newCrossElementArray);
          newCrossElementArray.addEventListener("click", () => {
            setTimeout(() => {
              SongAppTags.deleteTag(currentTags[i]);
            }, 1);
          });
        });
      }
    }
  }

  static checkTagContainerGap() {
    const tagDiv = document.querySelector(".tags-details");
    const tagContainer = document.querySelector(".tags-container");
    tagDiv.style.gap = "0";
    if (tagContainer.childElementCount != 0) {
      tagDiv.style.gap = "0.5rem";
    }
  }

  // Search for a matching tag and display all matches in the song sidebar
  static searchMatchingTags(tagToMatch) {
    if (document.querySelector(".tag-search")) {
      SongAppTags.removeSearchedTag();
    }
    SongAppSidebar.clearSongList();
    SongAppTags.displaySearchedTag(tagToMatch);
    songAppList.forEach((song) => {
      if (song.tags) {
        let songTagArray = song.tags;
        if (songTagArray.includes(tagToMatch)) {
          const sidebar = document.querySelector(".settings-navbar");
          const songTitle = song.title;
          const newSongButton = document.createElement("button");
          const newSongTitle = document.createTextNode(`${songTitle}`);
          newSongButton.classList.add("song-navbar");
          newSongButton.appendChild(newSongTitle);
          sidebar.before(newSongButton);
          SongAppSidebar.selectMostRecentSong();
          SongAppSidebar.addSongListeners();
        }
      }
    });
  }

  // Display the currently searched tag
  static displaySearchedTag(searchedTag) {
    const sidebar = document.querySelector(".settings-navbar");
    const searchedTagDisplay = document.createElement("div");
    const searchedTagText = document.createElement("h6");
    const clearSearchBtn = document.createElement("img");
    clearSearchBtn.src = "./SVG/cross.svg";
    searchedTagDisplay.classList.add("tag-search");
    searchedTagText.innerText = `Searched for: "${searchedTag}"`;
    searchedTagDisplay.appendChild(searchedTagText);
    searchedTagDisplay.appendChild(clearSearchBtn);
    sidebar.before(searchedTagDisplay);
    clearSearchBtn.addEventListener("click", () => {
      SongAppTags.removeSearchedTag();
    });
  }

  // Remove searched tag display
  static removeSearchedTag() {
    const searchedTag = document.querySelector(".tag-search");
    searchedTag.remove();
    SongAppSidebar.clearSongList();
    SongAppSidebar.createSongList();
    SongAppSidebar.addSongListeners();
    SongAppSidebar.selectMostRecentSong();
  }
}
