// json 파일 열기
const divAnswer = document.getElementById("answer");
const inputSearch = document.getElementById("search");
const divTitle = document.getElementById("title");
const divSelect = document.getElementById("select");
const divChaptersContainer = document.getElementById("chapters-container");
const divChapters = document.getElementById("chapters");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnContainer = document.getElementById("btn-container");
const btnPractice = document.getElementById("btn-practice");
const btnCancel = document.getElementById("btn-cancel");
const btnHide = document.getElementById("btn-hide");
const btnCheck = document.getElementById("btn-check");
const divPracticeContainer = document.getElementById("practice-container");
const res = [/\d+:\d+[~-]\d+:\d+/i, /\d+:\d+[~-]\d+/i, /\d+:\d+/i];
let { curBook, curChapter, curVerse } = [0, 0, 0];

let bible;
let bookList;
let dictWord;
let isHide = true;

//////////////////LOAD JSON FILE//////////////////////
fetch("bible.json")
    .then((response) => response.json())
    .then((data) => {
        bible = data;
        // console.log(data);

        bookList = Object.keys(bible); // bible.js 외부 변수 호출
        for (let b of bookList) {
            const div = document.createElement("div");
            div.className = "book";
            div.innerText = b;
            div.addEventListener("click", function () {
                showChapters(b);
            });
            divSelect.appendChild(div);
        }
    })
    .catch((error) => {
        console.error("JSON 파일을 불러오는 중 오류 발생:", error);
    });

fetch("word_dictionary.json")
    .then((response) => response.json())
    .then((data) => {
        dictWord = data;
        // console.log(dictWord);
    })
    .catch((error) => {
        console.error("JSON 파일을 불러오는 중 오류 발생:", error);
    });

//////////////////LISTENER//////////////////////
inputSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        search(inputSearch.value);
    }
});

divChaptersContainer.addEventListener("click", function () {
    divChaptersContainer.hidden = true;
});

divChapters.addEventListener("click", function (event) {
    event.stopPropagation();
});

btnPrev.addEventListener("click", () => {
    moveChapterPrev();
});

btnNext.addEventListener("click", () => {
    moveChapterNext();
});

btnPractice.addEventListener("click", () => {
    entry = [];
    for (const c of divAnswer.children) {
        c.children[1].classList.add("verse-practice");
        entry.push(c);
        let textarea = document.createElement("textarea");
        textarea.className = "ta-practice";
        textarea.rows = 1;
        textarea.placeholder = "답을 입력하세요";
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto"; //height 초기화
            textarea.style.height = textarea.scrollHeight + "px";
        });
        // entry.push(textarea);

        let div = document.createElement("div");
        div.className = "feedback";
        div.hidden = true;

        c.children[1].appendChild(div);
        c.children[1].appendChild(textarea);
    }
    setPractice(true);
    // divAnswer.innerHTML = "";
    // for (const e of entry) divAnswer.appendChild(e);
});

btnCancel.addEventListener("click", () => {
    search(divTitle.innerText);
});

btnHide.addEventListener("click", () => {
    for (const c of divAnswer.children) {
        if (c.className == "verse-container") {
            if (isHide) c.children[1].classList.remove("verse-practice");
            else c.children[1].classList.add("verse-practice");
        }
    }
    btnHide.children[0].hidden = isHide;
    btnHide.children[1].hidden = !isHide;
    isHide = !isHide;
});

btnCheck.addEventListener("click", () => {
    for (const c of divAnswer.children) {
        let value = c.children[1].children[2].value;
        if (value == "") {
            c.children[1].children[1].hidden = true;
            continue;
        }
        let answer = c.children[1].children[0].innerText;
        let feedback = compareWords(answer, value);
        c.children[1].children[1].innerHTML = feedback;
        c.children[1].children[1].hidden = false;
    }
});

//////////////////ABOUT ADDRESS//////////////////////
function updateBook(book) {
    curBook = book;
}

function updateChapter(chapter) {
    curChapter = Number(chapter);
}

function updateVerse(verse) {
    curVerse = Number(verse);
}

function getWord(book, chapter, verse) {
    return bible[book][chapter][verse].t;
}

function makeAddressText(book, chapter, startVerse, endVerse = startVerse) {
    if (startVerse == endVerse) {
        return book + chapter + ":" + startVerse;
    } else {
        return book + chapter + ":" + startVerse + "-" + endVerse;
    }
}

function setCurrentAddress(book, chapter, startVerse, endVerse = startVerse) {
    updateBook(book);
    updateChapter(chapter);
    updateVerse(startVerse);
    setTitle(makeAddressText(book, chapter, startVerse, endVerse));
}

function setTitle(title = "") {
    divTitle.innerText = title;
}

//////////////////PRACTICE//////////////////////
function setPractice(isStart) {
    divPracticeContainer.style.display = isStart ? "flex" : "none";
    btnContainer.hidden = isStart;
    btnPractice.hidden = isStart;
    btnCancel.hidden = !isStart;
    isHide = isStart;
}

//////////////////PAGE MOVE//////////////////////
function moveChapterPrev() {
    if (curChapter > 1) {
        let endVerse = Object.keys(bible[curBook][curChapter - 1]).length;
        search(makeAddressText(curBook, curChapter - 1, 1, endVerse));
    } else {
        let bookIndex = bookList.indexOf(curBook);
        if (bookIndex == 0) return;
        prevBook = bookList[bookIndex - 1];
        let lastChapter = Object.keys(bible[prevBook]).length;
        let endVerse = Object.keys(bible[prevBook][lastChapter]).length;
        search(makeAddressText(prevBook, lastChapter, 1, endVerse));
    }
}

function moveChapterNext() {
    let lastChapter = Object.keys(bible[curBook]).length;
    if (curChapter < lastChapter) {
        let endVerse = Object.keys(bible[curBook][curChapter + 1]).length;
        search(makeAddressText(curBook, curChapter + 1, 1, endVerse));
    } else {
        let bookIndex = bookList.indexOf(curBook);
        console.log("rnt", bookIndex, Object.keys(bible).length);
        if (bookIndex + 1 >= Object.keys(bible).length) return;
        nextBook = bookList[bookIndex + 1];
        let endVerse = Object.keys(bible[nextBook]["1"]).length;
        search(makeAddressText(nextBook, 1, 1, endVerse));
    }
}

//////////////////ABOUT SELECT//////////////////////
function hiddenSelect(isHidden) {
    for (const child of divSelect.children) {
        child.hidden = isHidden;
    }
    btnContainer.hidden = !isHidden;
    divTitle.hidden = !isHidden;
}

function goChapter(book, chapter) {
    divChaptersContainer.hidden = true;
    let endVerse = Object.keys(bible[book][chapter]).length;
    let keyword = makeAddressText(book, chapter, 1, endVerse);
    // console.log(keyword);
    // inputSearch.value = keyword;
    search(keyword);
}

function showChapters(book) {
    divChaptersContainer.hidden = false;
    chapters = Object.keys(bible[book]);
    divChapters.innerHTML = "";
    for (let c of chapters) {
        const div = document.createElement("div");
        div.className = "chapter";
        div.innerText = c;
        div.addEventListener("click", function () {
            console.log(c);
            goChapter(book, c);
        });
        divChapters.appendChild(div);
    }
}

//////////////////SEARCH//////////////////////
function search(keyword) {
    if (keyword == "") return;
    setPractice(false);
    // console.log("keyword: ", keyword);
    let trimKeyword = keyword.replace(/ /g, "");
    setTitle();
    if (
        !res[0].exec(trimKeyword) &&
        !res[1].exec(trimKeyword) &&
        !res[2].exec(trimKeyword)
    ) {
        searchWithWord(keyword);
        hiddenSelect(true);
        return;
    }

    // Search with address
    results = searchWithAddress(trimKeyword);
    html = "";
    for (v of results) {
        html += getDivVerse(v[2], v[3]);
    }
    divAnswer.innerHTML = html;

    hiddenSelect(true);
    btnPractice.hidden = false;
    scrollTop();
}

function searchWithAddress(keyword) {
    var result = [];
    var book, chapter, verse;
    if (res[0].exec(keyword)) {
        // console.log("유형 3");
    } else if (res[1].exec(keyword) || res[2].exec(keyword)) {
        var i = 0;
        while (i < keyword.length) {
            if (isNum(keyword[i])) break;
            i++;
        }
        book = keyword.substr(0, i);
        var j = i;
        while (j < keyword.length) {
            if (keyword[j] == ":") break;
            j++;
        }
        chapter = keyword.substr(i, j - i);

        if (res[1].exec(keyword)) {
            var sep = keyword.indexOf("~") == -1 ? "-" : "~";
            var [startVerse, endVerse] = keyword.substr(j + 1).split(sep);
            // console.log(startVerse, endVerse);
            for (var l = startVerse; l <= endVerse; l++) {
                result.push([
                    book,
                    Number(chapter),
                    Number(l),
                    getWord(book, chapter, l),
                ]);
            }
            setCurrentAddress(book, chapter, startVerse, endVerse);
        } else {
            // console.log("유형 1");
            verse = keyword.substr(j + 1, keyword.length - j);
            result.push([
                book,
                Number(chapter),
                Number(verse),
                getWord(book, chapter, verse),
            ]);
            setCurrentAddress(book, chapter, verse);
        }
    }

    return result;
}

function searchWithWord(keyword) {
    let keys = [];
    for (const key of Object.keys(dictWord)) {
        if (key.indexOf(keyword) >= 0) keys.push(key);
    }
    // console.log(keys);

    html = "";
    count = 0;
    for (const key of keys) {
        let correct = dictWord[key];
        for (const addr of correct) {
            // console.log(addr);
            let v = searchWithAddress(addr);
            html += getDivVerse(addr, v[0][3]);
            count++;
        }
    }

    divAnswer.innerHTML = html;
    setTitle(`검색결과: ${count}개`);
}

function getDivVerse(num, verse) {
    div = "";
    div += '<div class="verse-container">';
    div += `<div class="num">${num}</div>`;
    div += `<div class="verse"><div>${verse}</div></div>`;
    div += "</div>";
    return div;
}

//////////////////UTILITY//////////////////////
function isNum(val) {
    return !isNaN(val);
}

function scrollTop() {
    window.scrollTo(0, 0);
}
