
let playerScore = 0;
let totalQuestions = 1;
let currentQuestion = 0;
let currentQuestionIndex = 0;

let nextQuestionButton = document.getElementById("next-question-btn");
let donePlayingButton = document.getElementById("done-playing-btn");
let questionElement = document.querySelector(".question");
let container = document.querySelector(".container");
let body = document.querySelector("body");
let p;

let stillPlaying = true;
let showResult;
let resultHeading;
let questionArray = [];

let textarea = document.createElement("textarea");


async function FetchQuestions() {

    let apiURL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple";
    let response = await fetch(apiURL);
    let quizData = await response.json();

    questionArray = quizData.results;
    DisplayQuestion();
}

FetchQuestions();

function decodeHtml(html) {
    textarea.innerHTML = html;
    return textarea.value;
}


function DisplayQuestion() {
    if (stillPlaying) {

        nextQuestionButton.style.display = "block";
        donePlayingButton.style.display = "block";
    }
    if (currentQuestionIndex < questionArray.length) {
        currentQuestion = questionArray[currentQuestionIndex];
        questionElement.style.display = "block";
        questionElement.textContent = decodeHtml(currentQuestion.question);
        ClearOptions();


        let allOptions = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
        allOptions.sort(() => Math.random() - 0.5);

        let optionElementsArray = [];
        
        for (let option of allOptions) {
            let optionElement = document.createElement("button");
            optionElement.textContent = decodeHtml(option);
            optionElement.classList.add("answer-option");

            optionElementsArray.push(optionElement);

            optionElement.addEventListener("click", () => {

                if (option === currentQuestion.correct_answer) {
                    optionElement.style.backgroundColor = "green";
                    playerScore++;
                }
                else {
                    optionElement.style.backgroundColor = "red";
                }
            });

            container.append(optionElement);
        }

        currentQuestionIndex++;

        if (currentQuestionIndex === questionArray.length) {
            nextQuestionButton.style.display = "none";
            donePlayingButton.style.display = "none";

            p = document.createElement("p");
            p.textContent = "Last question...";
            p.classList.add("last-question");
            body.append(p);

            let answerOptions = document.querySelectorAll(".answer-option");
            answerOptions.forEach(optionElement => {
                optionElement.onclick = function() {
                    setTimeout(() => {
                        DisplayFinalResult();
                    }, 2000);
                }
            });
        }
    }
}

nextQuestionButton.onclick = async function () {
    DisplayQuestion();
    totalQuestions++;
}

donePlayingButton.onclick = function () {
    DisplayFinalResult();
}

function ClearOptions() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}


async function PlayAgain() {
    let playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play again!";
    playAgainButton.setAttribute("id", "play-again-btn");
    body.append(playAgainButton);

    playAgainButton.onclick = async function () {
        playerScore = 0;
        totalQuestions = 1;
        currentQuestionIndex = 0;
        stillPlaying = true;

        if (resultHeading && showResult) {
            body.removeChild(resultHeading)
            body.removeChild(showResult)
            body.removeChild(playAgainButton)
        }

        await FetchQuestions();
    }
}

function DisplayFinalResult() {
    ClearOptions();
    nextQuestionButton.style.display = "none";
    donePlayingButton.style.display = "none";
    questionElement.style.display = "none";
    body.removeChild(p);

    resultHeading = document.createElement("h4");
    resultHeading.textContent = "Your result is";
    body.append(resultHeading);

    showResult = document.createElement("p");
    showResult.textContent = playerScore + " of " + totalQuestions;
    showResult.classList.add("show-result");
    body.append(showResult);

    stillPlaying = false;

    setTimeout(() => {
        PlayAgain();
    }, 1000);
}

