const btn = document.getElementById("btn");
const input = document.getElementById("input");
const divFeedback = document.getElementById("feedback");
const divScore = document.getElementById("score");

btn.addEventListener("click", () => {
    var input_text = input.value;
    children = document.getElementById("answer").children;
    answer = "";
    for (const c of children) {
        answer += c.children[1].innerText + " ";
    }
    // console.log(answer);
    feedback = compareWords(answer, input_text);
    divFeedback.innerHTML = feedback;

    // console.log(feedback);

    const { correct, total, accuracy } = calculateAccuracy(answer, input_text);
    divScore.innerText = `정답률: ${correct} / ${total} (${accuracy})`;
});

// input에서 엔터를 누르면 버튼 클릭 이벤트 발생
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        btn.click();
    }
});

function wordSimilarity(a, b) {
    const m = a.length,
        n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n] / Math.max(m, n);
}

function compareWords(answer, input) {
    const aWords = answer.trim().split(/\s+/);
    const bWords = input.trim().split(/\s+/);

    const matchedA = new Array(aWords.length).fill(false);
    const matchedB = new Array(bWords.length).fill(false);
    const matchResult = new Array(aWords.length).fill(null);

    // Step 1: Match bWords to aWords
    for (let bIndex = 0; bIndex < bWords.length; bIndex++) {
        const bWord = bWords[bIndex];
        let bestMatch = -1;
        let bestScore = 0;

        for (let aIndex = 0; aIndex < aWords.length; aIndex++) {
            if (matchedA[aIndex]) continue;
            const score = wordSimilarity(aWords[aIndex], bWord);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = aIndex;
            }
        }

        if (bestScore === 1) {
            matchedA[bestMatch] = true;
            matchedB[bIndex] = true;
            matchResult[bestMatch] = bWord; // perfect match
        } else if (bestScore >= 0.5) {
            matchedA[bestMatch] = true;
            matchedB[bIndex] = true;
            matchResult[bestMatch] = {
                correct: aWords[bestMatch],
                input: bWord,
            };
        }
    }

    // Step 2: Build result with insertions preserved
    const result = [];
    let bPointer = 0;

    for (let i = 0; i < aWords.length; i++) {
        // Insert unmatched input words before current match
        while (
            bPointer < bWords.length &&
            !matchedB[bPointer] &&
            (matchResult[i] === null ||
                bWords[bPointer] !== matchResult[i]?.input)
        ) {
            result.push(`<span class="wrong">${bWords[bPointer]}</span>`);
            matchedB[bPointer] = true;
            bPointer++;
        }

        const match = matchResult[i];
        if (match === null) {
            result.push(`<span class="add">${aWords[i]}</span>`);
        } else if (typeof match === "string") {
            result.push(`<span class="correct">${match}</span>`);
            bPointer++;
        } else {
            result.push(
                `<span class="wrong">${match.input}</span><span class="add">(${match.correct})</span>`
            );
            bPointer++;
        }
    }

    // Remaining unmatched input words
    while (bPointer < bWords.length) {
        if (!matchedB[bPointer]) {
            result.push(`<span class="wrong">${bWords[bPointer]}</span`);
        }
        bPointer++;
    }

    return result.join(" ");
}

function calculateAccuracy(answer, input) {
    const aWords = answer.trim().split(/\s+/);
    const bWords = input.trim().split(/\s+/);

    let correctCount = 0;
    const matchedA = new Array(aWords.length).fill(false);
    const matchedB = new Array(bWords.length).fill(false);

    for (let bIndex = 0; bIndex < bWords.length; bIndex++) {
        const bWord = bWords[bIndex];
        for (let aIndex = 0; aIndex < aWords.length; aIndex++) {
            if (matchedA[aIndex]) continue;
            if (aWords[aIndex] === bWord) {
                matchedA[aIndex] = true;
                matchedB[bIndex] = true;
                correctCount++;
                break;
            }
        }
    }

    const totalWords = aWords.length;
    const accuracy = (correctCount / totalWords) * 100;

    return {
        correct: correctCount,
        total: totalWords,
        accuracy: accuracy.toFixed(2) + "%",
    };
}
