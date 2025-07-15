const textareaInput = document.getElementById("input");
const divLogo = document.getElementById("img-logo");
const divHome = document.getElementById("btn-home");
const btnSettings = document.getElementById("btn-settings");
const divSettingsContainer = document.getElementById("settings-container");
const divSettings = document.getElementById("settings");
const silderFontSize = document.getElementById("settings-fonts-size-silder");
const silderGapLetter = document.getElementById("settings-gat-letter-silder");
const silderGapWord = document.getElementById("settings-gap-word-silder");
const silderGapLine = document.getElementById("settings-gap-line-silder");
const silderGapVerse = document.getElementById("settings-gap-verse-silder");
const checkboxTheme = document.getElementById("settings-theme-checkbox");
const cutInputs = document.querySelectorAll(".cut-input");

let current_page = "home"; // home, select, view, practice, settings

const dict_light_mode = {
    "--bg-color": "#ffffff",
    "--unselected-color": "#888888",
    "--main-color": "#6984ff",
    "--cancel-color": "#f88",
    "--hover-color": "#ffee00",
    "--hover-color2": "#fffaafff",
    "--text-color": "#111",
    "--input-color": "#ddd",
    "--book1": "#d9f3fd",
    "--book2": "#eee",
    "--book3": "#c5f8e7",
    "--book4": "#ffd8d8",
    "--book5": "#d2f5ca",
    "--book6": "#f5def3",
    "--book7": "#f9ffbf",
    "--book7": "#fbb9fdff",
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
};

const dict_dark_mode = {
    "--bg-color": "#222",
    "--unselected-color": "#888888",
    "--main-color": "#6984ff",
    "--cancel-color": "#f88",
    "--hover-color": "#a1ebad",
    "--hover-color2": "#726d2cff",
    "--text-color": "#eee",
    "--input-color": "#444",
    "--book1": "#004f6e",
    "--book2": "#383838",
    "--book3": "#00422c",
    "--book4": "#7a2b2b",
    "--book5": "#164b0a",
    "--book6": "#63195d",
    "--book7": "#5b5c0f",
    "--book8": "#3e0c5aff",
    "--blur-color": "rgba(0, 0, 0, 0.333)",
    "--chapters-bg-color": "rgba(61, 61, 61, 0.9)",
    "--chapter-bg-color1": "#aaa",
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
    current_page = "settings";
});

divSettings.addEventListener("click", function (event) {
    event.stopPropagation();
});

divSettingsContainer.addEventListener("click", function () {
    divSettingsContainer.hidden = true;
    current_page = "view";
});

silderFontSize.oninput = getSettingFunction(
    silderFontSize,
    "--font-size",
    "rem"
);

silderGapLetter.oninput = getSettingFunction(
    silderGapLetter,
    "--gap-letter",
    "px"
);

silderGapWord.oninput = getSettingFunction(silderGapWord, "--gap-word", "px");

silderGapLine.oninput = getSettingFunction(silderGapLine, "--gap-line", "%");

silderGapVerse.oninput = getSettingFunction(
    silderGapVerse,
    "--gap-verse",
    "px"
);

cutInputs.forEach((input) => {
    input.addEventListener("change", function () {
        const selectedFont = this.value;
        setVariable("--verse-font", selectedFont);
        localStorage.setItem("--verse-font", selectedFont);
    });
});

function getSettingFunction(silder, variable, unit = "rem") {
    return function (e) {
        let value = silder.value;
        setVariable(variable, value + unit);
        localStorage.setItem(variable, value);
    };
}

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

    // Set initial value from localStorage
    getSettingValue("--font-size", "rem", silderFontSize, 1);

    getSettingValue("--gap-letter", "px", silderGapLetter, -1.5);

    getSettingValue("--gap-word", "px", silderGapWord, 3);

    getSettingValue("--gap-line", "%", silderGapLine, 180);

    getSettingValue("--gap-verse", "px", silderGapVerse, 15);

    const verseFont = getLocalStorageData("--verse-font", "Nanum Myeongjo");
    console.log("Verse font:", verseFont);
    setVariable("--verse-font", verseFont);
    cutInputs.forEach((input) => {
        if (input.value === verseFont) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
});

function getSettingValue(variable, unit, input, defaultValue) {
    const value = getLocalStorageData(variable, defaultValue);
    input.value = value;
    setVariable(variable, value + unit);
}

function getLocalStorageData(item, defalut = 1) {
    let value = localStorage.getItem(item);
    if (value === null) {
        return defalut;
    } else {
        return value;
    }
}

// Keyboard Shortcuts
document.addEventListener("keydown", function (event) {
    let tag = event.target.nodeName.toLowerCase();
    let tag_class = event.target.className.toLowerCase();
    // console.log("Key pressed:", event.key, "in tag:", tag, "class:", tag_class);
    if (tag === "textarea" && tag_class != "ta-practice") {
        // console.log("Ignoring key event in textarea");
        return;
    }
    if (tag === "input") {
        // console.log("Ignoring key event in input");
        return;
    }

    shortcuts(event, "pressed", tag);
});

document.addEventListener("keyup", function (event) {
    let tag = event.target.nodeName.toLowerCase();
    // console.log("Key released:", event.key, "in tag:", tag);
    if (tag === "input" || tag === "textarea") {
        // Ignore key events in input or textarea
        // return;
    }

    shortcuts(event, "released", tag);
});

function shortcuts(e, state, tag) {
    switch (e.key) {
        case "ArrowLeft":
            if (current_page === "view" && state === "pressed") {
                document.getElementById("btn-prev").click();
            }
            break;
        case "ArrowRight":
            if (current_page === "view" && state === "pressed") {
                document.getElementById("btn-next").click();
            }
            break;
        case "Enter":
            if (current_page === "view" && state === "pressed") {
                document.getElementById("btn-practice").click();
                current_page = "practice";
            }
            break;
        case "Escape":
            if (state === "pressed") {
                if (current_page === "practice") {
                    document.getElementById("btn-cancel").click();
                    current_page = "view";
                } else if (current_page === "view") {
                    // Go to home
                    location.reload(true);
                } else if (current_page === "home") {
                    // Do nothing, already at home
                } else {
                    // Close settings
                    divSettingsContainer.hidden = true;
                    divChaptersContainer.hidden = true;
                    current_page = "view";
                }
            }
            break;
        case "Control":
            if (state === "released") {
                if (current_page === "practice") {
                    isHide = false;
                    document.getElementById("btn-hide").click();
                }
            } else if (state === "pressed") {
                if (current_page === "practice") {
                    isHide = true;
                    document.getElementById("btn-hide").click();
                }
            }
            break;
        case "/":
            if (
                state === "pressed" &&
                current_page !== "settings" &&
                current_page !== "select" &&
                tag !== "input" &&
                tag !== "textarea"
            ) {
                document.getElementById("search").focus();
                document.getElementById("search").value = "dasdasdsad";
                current_page = "select";
            }
            break;
    }
}

// Utilities
function setVariable(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

function valueMapping(value, minValue1, maxValue1, minValue2, maxValue2) {
    return (
        ((value - minValue1) / (maxValue1 - minValue1)) *
            (maxValue2 - minValue2) +
        minValue2
    );
}
