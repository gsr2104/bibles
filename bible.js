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
let answers = [];

for (let b of listBook) {
    const div = document.createElement("div");
    div.className = "book";
    div.innerText = b;
    div.addEventListener("click", function () {
        if (getLastChapter(b) == 1) {
            goChapter(b, 1);
            return;
        }
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
        current_page = "view";
    }
});

divChaptersContainer.addEventListener("click", function () {
    divChaptersContainer.hidden = true;
    current_page = "home";
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
    answers = [];
    let idx = 0;
    let isFirst = true;
    let count = verseLengths[idx];
    let verses;
    if (inFolder) {
        verses = folderList[current_folder]["verse"].split(",");
        // console.log(verses);
    }

    for (const c of divAnswer.children) {
        c.children[1].classList.add("verse-practice");
        c.children[1].classList.add("verse-practice-temp");
        let v = c.children[1].innerText;
        answers.push(v);
        let texts = v.split(" ");
        let verseHTML = "";
        for (let i = 0; i < texts.length; i++) {
            verseHTML += `<span class="word-practice word-practice-temp">${texts[i]} </span>`;
        }
        c.children[1].innerHTML = verseHTML;
        entry.push(c);

        let textarea = document.createElement("textarea");
        textarea.className = "ta-practice";
        textarea.rows = 1;
        textarea.placeholder = "답을 입력하세요";
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto"; //height 초기화
            textarea.style.height = textarea.scrollHeight + "px";
        });
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                console.log("Enter pressed");
                const formElements = Array.from(
                    document.querySelectorAll(".ta-practice")
                ).filter((el) => !el.disabled && el.tabIndex !== -1);

                const currentIndex = formElements.indexOf(textarea);

                // 쉬프트를 누르고 엔터를 누르면 반대로 이동
                if (e.shiftKey) {
                    if (currentIndex > 0) {
                        formElements[currentIndex - 1].focus();
                    }
                } else if (
                    currentIndex > -1 &&
                    currentIndex < formElements.length - 1
                ) {
                    formElements[currentIndex + 1].focus();
                }
            }
        });
        // entry.push(textarea);

        let div = document.createElement("div");
        div.className = "feedback";
        div.hidden = true;

        c.children[1].appendChild(div);
        c.children[1].appendChild(textarea);

        if (inFolder) {
            let divPracticeVerse = c.children[1];
            let divVerse = c.children[0];
            let v = divVerse.cloneNode(true);
            v.innerText = v.innerText.split(":")[1];
            divVerse.remove();
            if (verseLengths[idx] > 1) {
                divPracticeVerse.prepend(v);
            }

            if (isFirst) {
                let divProblemNumber = document.createElement("div");
                divProblemNumber.className = "problem";
                divProblemNumber.innerHTML = `<span class="problem-num">${
                    idx + 1
                }</span><span class="problem-verse">${verses[idx]}</span>`;
                divPracticeVerse.prepend(divProblemNumber);
                isFirst = false;
            }
        }

        count -= 1;
        if (count <= 0) {
            isFirst = true;
            idx += 1;
            count = verseLengths[idx];
        }
    }
    setPractice(true);
    current_page = "practice";

    // divAnswer.innerHTML = "";
    // for (const e of entry) divAnswer.appendChild(e);
});

btnCancel.addEventListener("click", () => {
    if (inFolder) {
        moveToFolder(current_folder);
    } else {
        search(divTitle.innerText);
    }
    current_page = "view";
});

btnHide.addEventListener("click", () => {
    for (const c of divAnswer.children) {
        let verse = c.children[1];
        let words = verse.children;
        console.log(words);
        if (isHide) {
            for (const w of words) {
                // console.log(w);
                if (w.classList.contains("word-practice-temp")) {
                    w.classList.remove("word-practice");
                }
            }
        } else {
            for (const w of words) {
                if (w.classList.contains("word-practice-temp")) {
                    w.classList.add("word-practice");
                }
            }
        }
    }
    btnHide.children[0].style.display = isHide ? "none" : "block";
    btnHide.children[1].style.display = !isHide ? "none" : "block";
    isHide = !isHide;
});

btnCheck.addEventListener("click", () => {
    let idx = 0;
    for (const c of divAnswer.children) {
        let verse = c.children[1];
        let value = verse.lastChild.value;
        if (value == "") {
            verse.children[1].hidden = true;
            idx += 1;
            continue;
        }
        let answer = answers[idx];
        console.log(answer, value);
        let feedback = compareWords(answer, value);
        verse.children[verse.children.length - 2].innerHTML = feedback;
        verse.children[verse.children.length - 2].hidden = false;
        idx += 1;
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

// 요소들: 책, 폴더, 좌우버튼, 로고, 제목, 연습버튼
let showList = {
    view: {
        logo: false,
        book: false,
        folder: false,
        move: true,
        title: true,
        practice: true,
        save: true,
    },
};

//////////////////ABOUT SELECT//////////////////////
function hiddenSelect(isHidden) {
    for (const child of divSelect.children) {
        child.hidden = isHidden;
    }
    foldersContainer.hidden = isHidden;
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
        div.innerHTML = `<div class="chapter-num">${c}</div>`;
        div.addEventListener("click", function () {
            console.log(c);
            goChapter(book, c);
        });
        divChapters.appendChild(div);
    }
    current_page = "select";
}

//////////////////SEARCH//////////////////////
function search(keyword, showBook = false) {
    verseLengths = [];

    keyword = keyword.replaceAll("~", "-");
    keyword = keyword.replaceAll("/", ":");
    keyword = keyword.replaceAll(";", ":");
    keyword = keyword.replaceAll(".", ":");

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

    let splitedWithComma = checkKeyword.split(",");
    // Search with address
    if (splitedWithComma.length == 1) {
        let results = searchWithAddress(checkKeyword, showBook);
        divAnswer.innerHTML = results[0];
        verseLengths = [results[1]];
    } else {
        divAnswer.innerHTML = "";
        for (const k of splitedWithComma) {
            // console.log(k);
            let results = searchWithAddress(k, showBook);
            divAnswer.innerHTML += results[0];
            verseLengths.push(results[1]);
            setTitle(current_folder);
        }
    }

    current_page = "view";
    hiddenSelect(true);
    btnPractice.hidden = false;
    scrollTop();
}

function searchWithAddress(address, showBook = false) {
    address = address.replaceAll(" ", "");
    let length = 0;
    // console.log(address);
    let resultHTML = "";
    let codes = address2code(address);
    if (codes.length == 1) {
        // 단일 성구일 경우
        let [b, c, v] = code2address(codes[0]);
        // console.log(b, c, v);
        resultHTML += getDivVerse(showBook ? address : v, getWord(b, c, v));
        length = 1;
        setCurrentAddress(b, c, c, v, v);
    } else if (codes.length == 2) {
        // 범위 성구일 경우
        let [b, c1, v1] = code2address(codes[0]);
        let [_, c2, v2] = code2address(codes[1]);
        if (c1 == c2) {
            // 같은 장 내의 범위일 경우
            for (let v = v1; v <= v2; v++) {
                resultHTML += getDivVerse(
                    showBook ? b + c1 + ":" + v : v,
                    getWord(b, c1, v)
                );
                length += 1;
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
                    resultHTML += getDivVerse(
                        showBook ? b + c + ":" + v : c + ":" + v,
                        getWord(b, c, v)
                    );
                    length += 1;
                }
            }
            setCurrentAddress(b, c1, c2, v1, v2);
        }
    }

    return [resultHTML, length];
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
            let v,
                _ = searchWithAddress(addr);
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
