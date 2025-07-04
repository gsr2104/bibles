const textareaInput = document.getElementById("input");
const divLogo = document.getElementById("img-logo");
const divHome = document.getElementById("btn-home");
const btnSettings = document.getElementById("btn-settings");
const divSettingsContainer = document.getElementById("settings-container");
const divSettings = document.getElementById("settings");
const silderFontSize = document.getElementById("settings-fonts-size-silder");
const checkboxTheme = document.getElementById("settings-theme-checkbox");

let current_page = "home" // home, select, view, practice

const dict_light_mode = {
    "--bg-color": "#ffffff",
    "--unselected-color": "#888888",
    "--main-color": "#6984ff",
    "--cancel-color": "#f88",
    "--hover-color": "#a1ebad",
    "--text-color": "#333",
    "--font-size": "1rem",
    "--input-color": "#ddd",
    "--book1": "#d9f3fd",
    "--book2": "#eee",
    "--book3": "#c5f8e7",
    "--book4": "#ffd8d8",
    "--book5": "#d2f5ca",
    "--book6": "#f5def3",
    "--book7": "#f9ffbf",
    "--blur-color": "#fff3",
    "--chapters-bg-color": "grey",
    "--chapter-bg-color1": "#eee",
    "--chapter-bg-color2": "#bbb",
    "--chapter-text-color": "darkslategray",
    "--btn-move-color": "#ddd3",
    "--check-color": "#3c6",
    "--btn-color": "#ddd",
    "--feedback-add-color": "rgb(49, 49, 253)",
    "--feedback-wrong-color": "grey",
}

const dict_dark_mode = {
    "--bg-color": "#222",
    "--unselected-color": "#888888",
    "--main-color": "#6984ff",
    "--cancel-color": "#f88",
    "--hover-color": "#a1ebad",
    "--text-color": "#eee",
    "--font-size": "1rem",
    "--input-color": "#444",
    "--book1": "#004f6e",
    "--book2": "#383838",
    "--book3": "#00422c",
    "--book4": "#7a2b2b",
    "--book5": "#164b0a",
    "--book6": "#63195d",
    "--book7": "#5b5c0f",
    "--blur-color": "rgba(0, 0, 0, 0.333)",
    "--chapters-bg-color": "rgb(61, 61, 61)",
    "--chapter-bg-color1": "#888",
    "--chapter-bg-color2": "#aaa",
    "--chapter-text-color": "#222",
    "--btn-move-color": "rgba(117, 117, 117, 0.2)",
    "--check-color": "rgb(31, 126, 62)",
    "--btn-color": "#8d8d8d",
    "--feedback-add-color": "rgb(27, 127, 241)",
    "--feedback-wrong-color": "rgb(134, 134, 134)",
};

// Event Listeners
textareaInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

divHome.addEventListener("click", function () {
    location.reload(true);
});

divLogo.addEventListener("click", function () {
    location.reload(true);
});

btnSettings.addEventListener("click", function () {
    divSettingsContainer.hidden = false;
});

divSettings.addEventListener("click", function (event) {
    event.stopPropagation();
});

divSettingsContainer.addEventListener("click", function () {
    divSettingsContainer.hidden = true;
});

silderFontSize.oninput = function (e) {
    let fontSize = valueMapping(silderFontSize.value, 
        silderFontSize.min, 
        silderFontSize.max, 
        0.5, 
        7);
    setVariable("--font-size", fontSize + "rem");
    localStorage.setItem("font-size", fontSize);
};

checkboxTheme.addEventListener("change", function () {
    if (checkboxTheme.checked) {
        for (const [key, value] of Object.entries(dict_dark_mode)) {
            setVariable(key, value);
        }
        localStorage.setItem("theme", "dark");
    } else {
        for (const [key, value] of Object.entries(dict_light_mode)) {
            setVariable(key, value);
        }
        localStorage.setItem("theme", "light");
    }
});

// Initialize theme from localStorage
document.addEventListener("DOMContentLoaded", function () {
    let theme = localStorage.getItem("theme");

    if (!theme) {
        // If no theme is set, default to light mode
        theme = "light";
        localStorage.setItem("theme", theme);
    }

    if (theme === "dark") {
        checkboxTheme.checked = true;
        for (const [key, value] of Object.entries(dict_dark_mode)) {
            setVariable(key, value);
        }
    } else {
        checkboxTheme.checked = false;
        for (const [key, value] of Object.entries(dict_light_mode)) {
            setVariable(key, value);
        }
    }

    // Set initial font size from localStorage
    const fontSize = getLocalStorageData("font-size", 1);
    silderFontSize.value = valueMapping(fontSize, 0.5, 7, silderFontSize.min, silderFontSize.max);
    setVariable("--font-size", fontSize + "rem");
});

function getLocalStorageData(item, defalut=1) {
    let value = localStorage.getItem(item);
    if (value === null) {
        return defalut;
    } else {
        return parseFloat(value);
    }
}

// if (localStorage.getItem("bible")) {
//     bible = JSON.parse(localStorage.getItem("bible"));
//     isLoaded = true;
// } else {
//     fetch("bible.json")
//         .then((response) => response.json())
//         .then((data) => {
//             bible = data;
//             isLoaded = true;
//             localStorage.setItem("bible", JSON.stringify(bible));
//         })
//         .catch((error) => {
//             console.error("JSON 파일을 불러오는 중 오류 발생:", error);
//         });
// }


// Utilities
function setVariable(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

function valueMapping(value, minValue1, maxValue1, minValue2, maxValue2) {
    return ((value - minValue1) / (maxValue1 - minValue1)) * (maxValue2 - minValue2) + minValue2;
}