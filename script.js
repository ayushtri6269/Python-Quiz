let quizData = [
  {
    question: "What is the output of print(2 ** 3)?",
    options: ["6", "8", "9", "None"],
    correct: ["8"],
    type: "single"
  },
  {
    question: "Which of the following are Python data types?",
    options: ["String", "Integer", "Boolean", "Float"],
    correct: ["String", "Integer", "Boolean", "Float"],
    type: "multiple"
  },
  {
    question: "Which keyword is used for function in Python?",
    options: ["func", "def", "function", "lambda"],
    correct: ["def"],
    type: "single"
  },
  {
    question: "What is the output of len('Hello')?",
    options: ["4", "5", "6", "Hello"],
    correct: ["5"],
    type: "single"
  },
  {
    question: "Which of the following are valid variable names in Python?",
    options: ["myVar", "2ndVar", "var_name", "class"],
    correct: ["myVar", "var_name"],
    type: "multiple"
  },
  {
    question: "What is the purpose of the 'if __name__ == \"__main__\":' statement in Python?",
    options: [
      "To check if the script is being run directly",
      "To import modules",
      "To define a function",
      "To create a class"
    ],
    correct: ["To check if the script is being run directly"],
    type: "single"
  }
];

let timeLeft = 60;
let timerId;

function loadQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  quizData.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("mb-4");

    let optionsHTML = "";
    q.options.forEach(option => {
      const inputType = q.type === "multiple" ? "checkbox" : "radio";
      optionsHTML += `
        <div class="form-check">
          <input class="form-check-input" type="${inputType}" name="question${index}" value="${option}" id="${option + index}">
          <label class="form-check-label" for="${option + index}">${option}</label>
        </div>`;
    });

    qDiv.innerHTML = `<h5>Q${index + 1}: ${q.question}</h5>${optionsHTML}`;
    container.appendChild(qDiv);
  });
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  timerDisplay.innerText = `Time: ${timeLeft}s`;

  timerId = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      checkAnswers();
      disableQuiz();
      document.getElementById("result").innerHTML += `<div class="text-danger">⏰ Time's up!</div>`;
    }
  }, 1000);
}

function disableQuiz() {
  document.querySelectorAll('input').forEach(input => input.disabled = true);
  document.getElementById("submitBtn").disabled = true;
}

function checkAnswers() {
  clearInterval(timerId);
  let score = 0;

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  quizData.forEach((q, index) => {
    const selected = Array.from(document.querySelectorAll(`input[name="question${index}"]:checked`))
                          .map(i => i.value);
    const correct = q.correct.sort().toString();
    const chosen = selected.sort().toString();

    const questionDiv = document.querySelectorAll("#quiz-container > div")[index];

    if (correct === chosen) {
      score++;
      questionDiv.classList.add("border", "border-success", "p-2", "rounded");
    } else {
      questionDiv.classList.add("border", "border-danger", "p-2", "rounded");

      const explanation = document.createElement("div");
      explanation.classList.add("text-danger", "mt-2");
      explanation.innerHTML = `❌ Correct answer: <strong>${q.correct.join(", ")}</strong>`;
      questionDiv.appendChild(explanation);
    }
  });

  resultContainer.innerHTML = `Your Score: ${score}/${quizData.length}`;
  disableQuiz();
  document.getElementById("restartBtn").style.display = "inline-block";
}

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  const body = document.getElementById("pageBody");
  if (body.classList.contains("dark-mode")) {
    body.classList.replace("dark-mode", "light-mode");
    document.getElementById("themeToggle").innerText = "Switch to Dark Mode";
  } else {
    body.classList.replace("light-mode", "dark-mode");
    document.getElementById("themeToggle").innerText = "Switch to Light Mode";
  }
});

// Start and restart
window.onload = () => {
  const startBtn = document.getElementById("startBtn");
  const quizSection = document.getElementById("quizSection");
  const startSection = document.getElementById("startSection");

  startBtn.addEventListener("click", async () => {
    startSection.style.display = "none";
    quizSection.style.display = "block";
    loadQuiz();
    startTimer();
  });

  document.getElementById("submitBtn").addEventListener("click", checkAnswers);

  document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
  });
};
