const question = document.getElementById("question");
const options = document.getElementById("answer-buttons");
const category = document.getElementById("category");
const nextBtn = document.getElementById("next-btn");

const totalNumQuestions = 5;
let score = 0;
let questionIndex = 0;
let data = {};

document.addEventListener("DOMContentLoaded", () => {
  questionIndex = 0;
  score = 0;
  nextBtn.innerHTML = "Next";
  correctAnswer = "";
  data = {};
  loadQuestions();
});

async function loadQuestions() {
  questionIndex = 0;
  const apiUrl =
    "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple";
  const result = await fetch(`${apiUrl}`);
  data = await result.json();
  showQuestion(data);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function resetState() {
  nextBtn.style.display = "none";
  while (options.firstChild) {
    options.removeChild(options.firstChild);
  }
}

function showQuestion(data) {
  resetState();
  const correctAnswer = data.results[questionIndex].correct_answer;
  const answers = data.results[questionIndex].incorrect_answers;
  answers.splice(getRandomInt(3), 0, correctAnswer);
  question.innerHTML = `${questionIndex + 1}. ${
    data.results[questionIndex].question
  }`;
  category.innerHTML = data.results[questionIndex].category;
  category.style.display = "block";
  answers.forEach((element) => {
    let btn = document.createElement("button");
    if (element === correctAnswer) {
      btn.dataset.correct = true;
    }
    btn.innerHTML = element;
    btn.classList.add("btn");
    btn.addEventListener("click", selectAnswer);
    options.appendChild(btn);
  });
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  if (!selectedBtn.dataset.correct) {
    selectedBtn.classList.add("incorrect");
  } else {
    score++;
  }
  Array.from(options.children).forEach((button) => {
    if (button.dataset.correct) {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextBtn.style.display = "block";
}

function showScore() {
  resetState();
  question.innerHTML = `You scored ${score} out of ${totalNumQuestions}!`;
  category.style.display = "none";
  nextBtn.innerHTML = "Play Again";
  nextBtn.style.display = "block";
}

function handleNextButton() {
  questionIndex++;
  if (questionIndex < totalNumQuestions) {
    showQuestion(data);
  } else {
    showScore();
  }
}

nextBtn.addEventListener("click", () => {
  if (questionIndex < totalNumQuestions) {
    handleNextButton();
  } else {
    loadQuestions();
  }
});
