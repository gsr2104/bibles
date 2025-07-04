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
const imgLogo = document.getElementById("img-logo");
const btnsLogo = document.getElementById("btns-logo");
const btnPractice = document.getElementById("btn-practice");
const btnCancel = document.getElementById("btn-cancel");
const btnHide = document.getElementById("btn-hide");
const btnCheck = document.getElementById("btn-check");
const divPracticeContainer = document.getElementById("practice-container");
let { curBook, curChapter, curVerse } = [0, 0, 0];

let bible;

let dictWord;
let isHide = true;
let isLoaded = false;

for (let b of listBook) {
    const div = document.createElement("div");
    div.className = "book";
    div.innerText = b;
    div.addEventListener("click", function () {
        if (isLoaded) {
            showChapters(b);
        }
    });
    divSelect.appendChild(div);
}

//////////////////LOAD JSON FILE//////////////////////
if (localStorage.getItem("bible")) {
    bible = JSON.parse(localStorage.getItem("bible"));
    isLoaded = true;
} else {
    fetch("bible.json")
        .then((response) => response.json())
        .then((data) => {
            bible = data;
            isLoaded = true;
            localStorage.setItem("bible", JSON.stringify(bible));
        })
        .catch((error) => {
            console.error("JSON 파일을 불러오는 중 오류 발생:", error);
        });
}

// 단어 사전 불러오기
if (localStorage.getItem("word_dictionary")) {
    dictWord = JSON.parse(localStorage.getItem("word_dictionary"));
} else {
    fetch("word_dictionary.json")
        .then((response) => response.json())
        .then((data) => {
            dictWord = data;
            // console.log(dictWord);
            localStorage.setItem("word_dictionary", JSON.stringify(dictWord));
        })
        .catch((error) => {
            console.error("JSON 파일을 불러오는 중 오류 발생:", error);
        });
}

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
    btnHide.children[0].style.display = isHide ? "none" : "block";
    btnHide.children[1].style.display = !isHide ? "none" : "block";
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

function makeAddressText(book, c1, c2 = c1, v1, v2 = v1) {
    if (c1 == c2) {
        if (v1 == v2) {
            return book + c1 + ":" + v1;
        } else {
            return book + c1 + ":" + v1 + "-" + v2;
        }
    } else {
        return book + c1 + ":" + v1 + "-" + c2 + ":" + v2;
    }
}

function setCurrentAddress(book, c1, c2, v1, v2 = v1) {
    updateBook(book);
    updateChapter(c1);
    updateVerse(v1);
    setTitle(makeAddressText(book, c1, c2, v1, v2));
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
        search(
            makeAddressText(
                curBook,
                curChapter - 1,
                curChapter - 1,
                1,
                endVerse
            )
        );
    } else {
        let bookIndex = listBook.indexOf(curBook);
        if (bookIndex == 0) return;
        prevBook = listBook[bookIndex - 1];
        let lastChapter = Object.keys(bible[prevBook]).length;
        let endVerse = Object.keys(bible[prevBook][lastChapter]).length;
        search(
            makeAddressText(prevBook, lastChapter, lastChapter, 1, endVerse)
        );
    }
}

function moveChapterNext() {
    let lastChapter = Object.keys(bible[curBook]).length;
    if (curChapter < lastChapter) {
        let endVerse = Object.keys(bible[curBook][curChapter + 1]).length;
        search(
            makeAddressText(
                curBook,
                curChapter + 1,
                curChapter + 1,
                1,
                endVerse
            )
        );
    } else {
        let bookIndex = listBook.indexOf(curBook);
        console.log("rnt", bookIndex, Object.keys(bible).length);
        if (bookIndex + 1 >= Object.keys(bible).length) return;
        nextBook = listBook[bookIndex + 1];
        let endVerse = Object.keys(bible[nextBook]["1"]).length;
        search(makeAddressText(nextBook, 1, 1, 1, endVerse));
    }
}

//////////////////ABOUT SELECT//////////////////////
function hiddenSelect(isHidden) {
    for (const child of divSelect.children) {
        child.hidden = isHidden;
    }
    btnContainer.hidden = !isHidden;
    imgLogo.hidden = isHidden;
    btnsLogo.hidden = !isHidden;
    divTitle.hidden = !isHidden;
}

function goChapter(book, chapter) {
    divChaptersContainer.hidden = true;
    let endVerse = Object.keys(bible[book][chapter]).length;
    let keyword = makeAddressText(book, chapter, chapter, 1, endVerse);
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
    keyword = keyword.replaceAll("~", "-");
    keyword = keyword.replaceAll("/", ":");
    keyword = keyword.replaceAll(";", ":");

    keyword = keyword.replace("ㅈ", ":");
    let checkKeyword = keyword
        .replaceAll("장", ":")
        .replaceAll("절", "")
        .replaceAll(" ", "");
    if (keyword == "") return;
    setPractice(false);
    setTitle();
    let isAddress = false;
    for (r of res) {
        if (r.exec(checkKeyword)) {
            isAddress = true;
            break;
        }
    }
    if (!isAddress) {
        searchWithWord(keyword);
        hiddenSelect(true);
        return;
    }

    // Search with address
    divAnswer.innerHTML = searchWithAddress(checkKeyword);

    hiddenSelect(true);
    btnPractice.hidden = false;
    scrollTop();
}

function searchWithAddress(address) {
    address = address.replaceAll(" ", "");
    console.log(address);
    let resultHTML = "";
    let codes = address2code(address);
    if (codes.length == 1) {
        // 단일 성구일 경우
        let [b, c, v] = code2address(codes[0]);
        console.log(b, c, v);
        resultHTML += getDivVerse(v, getWord(b, c, v));
        setCurrentAddress(b, c, c, v, v);
    } else if (codes.length == 2) {
        // 범위 성구일 경우
        let [b, c1, v1] = code2address(codes[0]);
        let [_, c2, v2] = code2address(codes[1]);
        if (c1 == c2) {
            // 같은 장 내의 범위일 경우
            for (let v = v1; v <= v2; v++) {
                resultHTML += getDivVerse(v, getWord(b, c1, v));
            }
            setCurrentAddress(b, c1, c2, v1, v2);
        } else {
            // 다른 장의 범위일 경우
            for (let c = c1; c <= c2; c++) {
                let _v1, _v2;
                _v1 = c == c1 ? v1 : 1;
                _v2 = c == c2 ? v2 : getLastVerse(b, c);
                // console.log(b, c, _v1, _v2);
                for (let v = _v1; v <= _v2; v++) {
                    resultHTML += getDivVerse(c + ":" + v, getWord(b, c, v));
                }
            }
            setCurrentAddress(b, c1, c2, v1, v2);
        }
    }

    return resultHTML;
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
