"use strict"

const removeSettingsModal = (e) => {
  const settingsModal = document.querySelector(".settings-modal");
  if (settingsModal !== e.target && !settingsModal.contains(e.target)) {
    settingsModal.remove();
    document.getElementById("song-app").style.opacity = "1";
    document.removeEventListener("click", removeSettingsModal);
  }
};

export default class SongAppSettings {
  static addPrefBtnListener() {
    const prefButton = document.querySelector(".pref-navbar");
    prefButton.addEventListener("click", () => {
      SongAppSettings.createSettingsModal();
    });
  }

  static createSettingsModal() {
    const settingsModal = document.createElement("div");
    settingsModal.classList.add("settings-modal");
    // Font Slider
    const fontSliderLabel = document.createElement("label");
    fontSliderLabel.setAttribute("for", "font-slider");
    fontSliderLabel.innerText = "Font Size:";
    const fontSlider = document.createElement("input");
    fontSlider.type = "range";
    fontSlider.name = "font-slider";
    fontSlider.id = "font-slider";
    fontSlider.step = "2";
    fontSlider.min = "12";
    fontSlider.max = "20";
    fontSlider.value = "16";
    settingsModal.appendChild(fontSliderLabel);
    settingsModal.appendChild(fontSlider);
    const html = document.querySelector("html");
    const compHtmlStyle = window.getComputedStyle(html);
    fontSlider.value = compHtmlStyle.getPropertyValue("font-size").slice(0, 2);
    // Dark Mode
    const darkModeDesc = document.createElement("label");
    darkModeDesc.innerText = "Dark Mode:";
    darkModeDesc.classList.add("darkmode-desc");
    const darkModeLabel = document.createElement("label");
    darkModeLabel.classList.add("darkmode-switch");
    const darkModeInput = document.createElement("input");
    darkModeInput.classList.add("darkmode-input");
    darkModeInput.setAttribute("type", "checkbox");
    const body = document.body;
    const compStyle = window.getComputedStyle(body);
    if (compStyle.getPropertyValue("background-color") === "rgb(34, 34, 35)") {
      darkModeInput.checked = true;
    }
    darkModeInput.addEventListener("click", () => {
      if (darkModeInput.checked) {
        document.querySelector("link").href = "../styles-darkmode.css";
      } else if (!darkModeInput.checked) {
        document.querySelector("link").href = "../styles.css";
      }
    });
  
    const darkModeSlider = document.createElement("span");
    darkModeSlider.classList.add("darkmode-slider");
    darkModeLabel.appendChild(darkModeInput);
    darkModeLabel.appendChild(darkModeSlider);
    darkModeDesc.appendChild(darkModeLabel);
    settingsModal.appendChild(darkModeDesc);
    document.querySelector("body").appendChild(settingsModal);
  
    document.getElementById("song-app").style.opacity = "0.25";
  
    setTimeout(() => {
      document.addEventListener("click", removeSettingsModal);
    }, 200);
  
    fontSlider.addEventListener("click", () => {
      document.querySelector("html").style.fontSize = fontSlider.value + "px";
    });
  }
}