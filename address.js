// 성경 주소 표기법

// 00 000 000
// 앞 두자리: 책(1~66권)
// 그 다음 세자리: 장 세자리
// 그 다음 세자리: 절 세자리

const listBook = [
    // 책 목록, 한글자로
    "창",
    "출",
    "레",
    "민",
    "신",
    "수",
    "삿",
    "룻",
    "삼상",
    "삼하",
    "왕상",
    "왕하",
    "대상",
    "대하",
    "스",
    "느",
    "에",
    "욥",
    "시",
    "잠",
    "전",
    "아",
    "사",
    "렘",
    "애",
    "겔",
    "단",
    "호",
    "욜",
    "암",
    "옵",
    "욘",
    "미",
    "나",
    "합",
    "습",
    "학",
    "슥",
    "말",
    "마",
    "막",
    "눅",
    "요",
    "행",
    "롬",
    "고전",
    "고후",
    "갈",
    "엡",
    "빌",
    "골",
    "살전",
    "살후",
    "딤전",
    "딤후",
    "딛",
    "몬",
    "히",
    "약",
    "벧전",
    "벧후",
    "요일",
    "요이",
    "요삼",
    "유",
    "계",
];

const listLastChapter = [
    50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150,
    31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16,
    24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1,
    1, 22,
];

const dictKeyword2Book = {
    창: ["창새", "창세기", "ㅊㅅㄱ", "창새기", "ㅊ", "ㅊㅅ", "창세", "창"],
    출: ["출애", "출애굽기", "ㅊㅇ", "출", "ㅊㅇㄱ", "출애굽"],
    레: ["레", "ㄹㅇ", "레위기", "ㄹㅇㄱ", "레위"],
    민: ["민", "ㅁㅅ", "민수기", "ㅁㅅㄱ", "민수"],
    신: ["신명기", "신명", "신", "ㅅㅁㄱ", "ㅅㅁ"],
    수: ["여호수아", "ㅅㅇ", "수", "ㅇㅎㅅㅇ"],
    삿: ["사사기", "ㅅㅅㄱ", "삿", "ㅅㅅ", "사사"],
    룻: ["룻기", "룻", "ㄹㄱ"],
    삼상: ["사무상", "삼상", "사무엘상", "ㅅㅁㅅ"],
    삼하: ["사무하", "삼하", "사무엘하", "ㅅㅁㅎ"],
    왕상: ["왕상", "열왕기상", "열왕상", "ㅇㅇㄱㅅ"],
    왕하: ["ㅇㅇㄱㅎ", "왕하", "열왕기하", "열왕하"],
    대상: ["역대상", "ㅇㄷㅅ", "대상"],
    대하: ["ㅇㄷㅎ", "역대하", "대하"],
    스: ["스", "ㅇㅅㄹ", "에스라"],
    느: ["느", "느헤미야", "ㄴㅎㅁㅇ", "ㄴ"],
    에: ["에스더", "ㅇㅅㄷ", "에"],
    욥: ["ㅇㄱ", "욥기", "욥"],
    시: ["ㅅㅍ", "시", "시편"],
    잠: ["잠언", "ㅈㅇ", "잠", "ㅈ", "잠언서"],
    전: ["전도서", "ㅈㄷㅅ", "전", "전도"],
    아: ["아가서", "ㅇㄱ", "아가", "아"],
    사: ["ㅇㅅㅇ", "ㅅ", "이사", "사", "이사야"],
    렘: ["예레미야", "ㅇㄹㅁㅇ", "렘"],
    애: ["애", "애가", "예레미야애가", "ㅇㄹㅁㅇㅇㄱ"],
    겔: ["에스겔", "겔", "ㅇㅅㄱ"],
    단: ["단", "ㄷㄴㅇ", "다니엘", "ㄷ"],
    호: ["호", "ㅎㅅㅇ", "호세아"],
    욜: ["요엘", "ㅇㅇ", "욜"],
    암: ["암", "아모스", "ㅇㅁㅅ"],
    옵: ["옵", "오바댜", "ㅇㅂㄷ"],
    욘: ["ㅇㄴ", "욘", "요나"],
    미: ["미가", "ㅁㄱ", "미"],
    나: ["나", "나훔", "ㄴㅎ"],
    합: ["ㅎㅂㄱ", "하박국", "합"],
    습: ["습", "ㅅㅂㄴ", "스바냐"],
    학: ["학", "ㅎㄱ", "학개"],
    슥: ["ㅅㄱㄹ", "슥", "스가랴"],
    말: ["말라기", "말", "ㅁㄹㄱ"],
    마: ["ㅁㅌ", "ㅁㅌㅂㅇ", "마태", "마태복음", "마", "ㅁ"],
    막: ["ㅁㄱㅂㅇ", "ㅁㄱ", "막", "마가", "마가복음"],
    눅: ["ㄴㄱ", "누가", "ㄴㄱㅂㅇ", "누가복음", "눅"],
    요: ["요한", "ㅇㅎ", "요한복음", "요", "ㅇㅎㅂㅇ", "ㅇ"],
    행: ["ㅅㄷㅎㅈ", "사도행전", "행"],
    롬: ["ㄹㅁㅅ", "로마서", "롬", "ㄻ", "ㄹㅁ", "ㄹ"],
    고전: ["고전", "ㄱㄹㄷㅈㅅ", "고린도전서", "고", "ㄱㅈ"],
    고후: ["고린도후서", "고후", "ㄱㄹㄷㅎㅅ", "ㄱㅎ"],
    갈: ["ㄱㄹㄷㅇㅅ", "갈라디아서", "갈", "갈라", "갈라디아"],
    엡: ["에베소서", "ㅇㅂㅅㅅ", "엡", "에베소", "애배소", "ㅇㅂㅅ"],
    빌: ["빌", "ㅂㄹㅂㅅ", "빌립보서", "ㅂ"],
    골: ["골로새서", "골", "ㄱㄹㅅㅅ"],
    살전: ["ㄷㅅㄹㄴㄱㅈㅅ", "데살로니가전서", "살전", "살", "ㅅㅈ"],
    살후: ["데살로니가후서", "살후", "ㄷㅅㄹㄴㄱㅎㅅ", "ㅅㅎ"],
    딤전: ["디모데전서", "ㄷㅁㄷㅈㅅ", "딤전", "ㄷㅈ", "딤"],
    딤후: ["디모데후서", "딤후", "ㄷㅁㄷㅎㅅ", "ㄷㅎ"],
    딛: ["딛", "디도서", "ㄷㄷㅅ"],
    몬: ["몬", "빌레몬서", "ㅂㄹㅁㅅ"],
    히: ["ㅎㅂㄹㅅ", "히", "히브리서", "ㅎ", "히브", "히브리"],
    약: ["약", "야고보서", "ㅇㄱㅂㅅ", "ㅇㄱㅂ", "야고보", "야보고"],
    벧전: ["ㅂㄷㄹㅈㅅ", "벧전", "베드로전서", "ㅂㅈ", "벧"],
    벧후: ["벧후", "ㅂㄷㄹㅎㅅ", "베드로후서", "ㅂㅎ"],
    요일: ["ㅇㅎㅇㅅ", "요일", "요한일서", "요1", "ㅇ1"],
    요이: ["ㅇㅎㅇㅅ", "요이", "요한이서", "요2", "ㅇ2"],
    요삼: ["요삼", "ㅇㅎㅅㅅ", "요한삼서", "요3", "ㅇ3"],
    유: ["유", "유다서", "ㅇㄷㅅ", "ㅇㄷ"],
    계: ["계", "요한계시록", "계시록", "ㅇㅎㄱㅅㄹ", "ㄱ", "ㄱㅅㄹ", "ㄳㄹ"],
};

const res = [
    /\d+:\d+-\d+:\d+/i, // ex) 창1:1-2:5
    /\d+:\d+-\d+/i, // ex) 창 1:1-5
    /\d+:\d+/i, // ex) 창 1:1
    /\d+장/i, // ex) 창 1장
    /\d+/i, // ex) 창 1
    /\d+:\d+-\d+:$/i, // ex) 창 1:1-2:
    /\d+:-\d+:$/i, // ex) 창 1:-2:
    /\d+:-\d+:\d+/i, // ex) 창 1:-2:5
];

function code2address(code) {
    code = Number(code);
    var b, c, v;
    var codeBook = Math.floor(code / 1000000);
    b = listBook[codeBook];
    c = Math.floor((code % 1000000) / 1000);
    v = code % 1000;
    return [b, c, v];
}

function keyword2book(keyword) {
    keyword = keyword.trim();
    for (const [book, keywords] of Object.entries(dictKeyword2Book)) {
        if (keywords.includes(keyword)) {
            return book;
        }
    }
    return null; // 매칭되는 책이 없을 경우
}

function book2code(book) {
    var code = listBook.indexOf(book);
    code = String(code).padStart(2, "0");
    return code;
}

function getLastChapter(book) {
    return listLastChapter[listBook.indexOf(book)];
}

function getLastVerse(book, chapter) {
    return Object.keys(bible[book][chapter]).length;
}

function address2code(address) {
    let type = 0;
    let book, chapter, verse;
    let c1, v1, c2, v2;
    let i = 0;
    while (i < address.length) {
        if (isNum(address[i])) break;
        i++;
    }
    book = address.substr(0, i);
    book = keyword2book(book);
    let j = i;
    while (j < address.length) {
        if (address[j] == ":") break;
        j++;
    }
    if (
        res[0].exec(address) ||
        res[5].exec(address) ||
        res[6].exec(address) ||
        res[7].exec(address)
    ) {
        // 장 범위 검색. ex) 창1:1-2:5
        type = 3;
        let range = address.substr(i).replace(" ", "");
        let [r1, r2] = range.split("-");
        if (res[0].exec(address)) {
            [c1, v1] = r1.split(":");
            [c2, v2] = r2.split(":");
        }
        if (res[5].exec(address)) {
            console.log(5);
            // 창1:1-2: 형식의 경우
            [c1, v1] = r1.split(":");
            c2 = r2.replace(":", "");
            v2 = getLastVerse(book, c2);
        } else if (res[7].exec(address)) {
            console.log(7);
            // 창1:-2:5 형식의 경우
            c1 = r1.replace(":", "");
            v1 = 1;
            [c2, v2] = r2.split(":");
        } else if (res[6].exec(address)) {
            console.log(6);
            // 창1:-2: 형식의 경우
            c1 = r1.replace(":", "");
            v1 = 1;
            c2 = r2.replace(":", "");
            v2 = getLastVerse(book, c2);
        }
        if (c1 >= c2 && v1 >= v2) {
            chapter = c1;
            verse = v1;
            type = 1;
        } else if (c1 >= c2) {
            chapter = c1;
            v1 = v1;
            v2 = v2;
            type = 2;
        }
    } else if (res[1].exec(address) || res[2].exec(address)) {
        chapter = Number(address.substr(i, j - i).trim());
        if (res[1].exec(address)) {
            // 절 범위 검색. ex) 창1:1-3
            type = 2;
            [v1, v2] = address.substr(j + 1).split("-");
            if (v1 == v2) {
                verse = v1;
                type = 1;
            }
        } else {
            // 절 검색. ex) 창1:1
            verse = address.substr(j + 1, address.length - j);
            type = 1;
        }
    } else if (res[3].exec(address) || res[4].exec(address)) {
        // 장 검색. ex) 창 1장, 창 1
        type = 4;
    }

    console.log("유형: " + type);

    switch (type) {
        case 1:
            return [
                book2code(book) +
                    String(chapter).padStart(3, "0") +
                    String(verse).padStart(3, "0"),
            ];
        case 2:
            var lastVerse = getLastVerse(book, chapter);
            if (v1 > lastVerse) v1 = 1;
            if (v2 > lastVerse) v2 = lastVerse;
            return [
                book2code(book) +
                    String(chapter).padStart(3, "0") +
                    String(v1).padStart(3, "0"),
                book2code(book) +
                    String(chapter).padStart(3, "0") +
                    String(v2).padStart(3, "0"),
            ];
        case 3:
            var lastVerse1 = getLastVerse(book, c1);
            var lastVerse2 = getLastVerse(book, c2);
            if (v1 > lastVerse1) v1 = lastVerse1;
            if (v2 > lastVerse2) v2 = lastVerse2;
            return [
                book2code(book) +
                    String(c1).padStart(3, "0") +
                    String(v1).padStart(3, "0"),
                book2code(book) +
                    String(c2).padStart(3, "0") +
                    String(v2).padStart(3, "0"),
            ];
        case 4:
            address = address.replace("장", "");
            chapter = Number(address.substr(i, j - i).trim());

            var lastChapter = getLastChapter(book);
            if (chapter > lastChapter) chapter = lastChapter;

            console.log(book, chapter);
            return [
                book2code(book) + String(chapter).padStart(3, "0") + "001",
                book2code(book) +
                    String(chapter).padStart(3, "0") +
                    String(getLastVerse(book, chapter)).padStart(3, "0"),
            ];
    }

    return [];
}
