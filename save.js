const btnSelect = document.getElementById("btn-select");
const btnFolderAdd = document.getElementById("folder-add");
const folderAdderContainer = document.getElementById("folder-adder-container");
const foldersContainer = document.getElementById("folders-container");
const folderAdder = document.getElementById("folder-adder");
const folderColors = document.getElementById("folder-colors");
const btnFolderCreate = document.getElementById("btn-folder-create");
const btnFolderDelete = document.getElementById("btn-folder-delete");
const divFolders = document.getElementById("folders");
const folderVerseContainer = document.getElementById("folder-verse-container");
const folderVerse = document.getElementById("folder-verse");
const btnFolderVerse = document.getElementById("btn-folder-verse");
const folderNameLabel = document.getElementById("folder-name-label");
const inputFolderVerse = document.getElementById("input-folder-verse");

let current_folder = "";
let verseLengths = [];

let html = "";
for (let i = 1; i <= 8; i++) {
    html += `
        <input
            hidden
            type="radio"
            name="folder-color"
            class="folder-color"
            id="folder-color-${i}"
            value="${i}"
            ${i == 1 ? "checked" : ""}
        />
        <label class="folder-color-label" for="folder-color-${i}"
            ><div style="background-color: var(--book${i});">　</div></label
        >
    `;
}
folderColors.innerHTML = html;

let folderList = localStorage.getItem("folder_list");
if (folderList != null) {
    folderList = JSON.parse(folderList);

    for (const folder in folderList) {
        let divFolder = document.createElement("div");
        divFolder.classList.add("folder");
        divFolder.id = `folder-${folder}`;
        divFolder.innerHTML = `<span class="material-icons folder-icon" style="color: var(--book${folderList[folder]["color"]}) !important">folder</span><div class="folder-label">${folder}</div>`;

        divFolder.addEventListener("click", (e) => {
            let verse = folderList[folder]["verse"];
            if (verse === "" || current_page === "view") {
                // 폴더 설정
                current_page = "settings";
                current_folder = folder;
                let f = localStorage.getItem("folder_list");
                f = JSON.parse(f);
                let verse = f[folder]["verse"];
                if (verse != null) inputFolderVerse.value = verse;

                folderVerseContainer.hidden = false;
                folderNameLabel.innerText = folder;
                folderNameLabel.style.color = `var(--book${folderList[folder]["color"]})`;
            } else {
                // 폴더로 이동
                moveToFolder(folder, divFolder);
                return;
            }
        });
        divFolders.prepend(divFolder);
    }
}

function moveToFolder(folder, divFolder = null) {
    if (divFolder == null) {
        divFolder = document.getElementById(`folder-${current_folder}`);
    }

    console.log("move to " + folder);
    divAnswer.innerHTML = "";

    current_folder = folder;
    current_page = "view";
    inFolder = true;

    let verse = folderList[folder]["verse"];
    search(verse, (showBook = true));

    divTitle.innerHTML = "";
    divTitle.append(divFolder);
    btnContainer.hidden = true;
}

let textarea = document.createElement("textarea");
textarea.className = "ta-practice";
textarea.rows = 1;
textarea.placeholder = "답을 입력하세요";
textarea.addEventListener("input", () => {
    textarea.style.height = "auto"; //height 초기화
    textarea.style.height = textarea.scrollHeight + "px";
});

// btnSelect.addEventListener("click", () => {
//     entry = [];
//     answers = [];
//     for (const c of divAnswer.children) {
//         let v = c.children[1];
//         v.classList.add("verse-save");
//         v.addEventListener("click", (e) => {
//             if (v.classList.contains("verse-selected")) {
//                 v.classList.remove("verse-selected");
//             } else {
//                 v.classList.add("verse-selected");
//             }
//         });
//     }
//     btnContainer.hidden = true;
//     btnPractice.hidden = true;
//     btnCancel.hidden = false;
//     // setPractice(true);
//     current_page = "save";
//     // divAnswer.innerHTML = "";
//     // for (const e of entry) divAnswer.appendChild(e);
// });

btnFolderAdd.addEventListener("click", (e) => {
    folderAdderContainer.hidden = false;
});

folderAdderContainer.addEventListener("click", (e) => {
    folderAdderContainer.hidden = true;
});

folderAdder.addEventListener("click", (e) => {
    e.stopPropagation();
});

btnFolderCreate.addEventListener("click", (e) => {
    let folderName = document.getElementById("input-folder-name");
    let folderColor = document.querySelector(".folder-color:checked").value;
    folderColor = Number(folderColor);
    console.log(folderName.value, folderColor);

    if (folderName.value === "") {
        document.getElementById("folder-name-alert").hidden = false;
        folderName.focus();
        return;
    }

    if (localStorage.getItem("folder_list") == null) {
        localStorage.setItem("folder_list", "{}");
    }

    let f = localStorage.getItem("folder_list");
    f = JSON.parse(f);
    f[folderName.value] = { color: folderColor, verse: "" };
    localStorage.setItem("folder_list", JSON.stringify(f));

    // folderName.value = "";
    // folderAdderContainer.hidden = true;
    // document.getElementById("folder-name-alert").hidden = true;

    location.reload(true);
});

folderVerseContainer.addEventListener("click", (e) => {
    folderVerseContainer.hidden = true;
});

folderVerse.addEventListener("click", (e) => {
    e.stopPropagation();
});

// inputFolderVerse.addEventListener("input", () => {
//     inputFolderVerse.style.height = "auto"; //height 초기화
//     inputFolderVerse.style.height = inputFolderVerse.scrollHeight + "px";
// });

btnFolderVerse.addEventListener("click", (e) => {
    if (inputFolderVerse.value === "") {
        folderVerseContainer.hidden = true;
        return;
    }
    let verses = inputFolderVerse.value.split(",");
    let verse_string = "";
    let isFirst = true;
    for (const verse of verses) {
        let v = makeCorrectAddress(verse);
        if (v == null || v == "null") continue;
        if (!isFirst) verse_string += ", ";
        else isFirst = false;
        verse_string += v;
    }

    let f = localStorage.getItem("folder_list");
    f = JSON.parse(f);
    f[current_folder]["verse"] = verse_string;
    localStorage.setItem("folder_list", JSON.stringify(f));

    folderVerseContainer.hidden = true;

    moveToFolder(current_folder);
    location.reload(true);
});

btnFolderDelete.addEventListener("click", (e) => {
    if (!confirm("정말로 폴더를 삭제하시겠습니까?")) return;
    let f = localStorage.getItem("folder_list");
    f = JSON.parse(f);
    delete f[current_folder];
    localStorage.setItem("folder_list", JSON.stringify(f));

    location.reload(true);
});
