const store = {
  questions: [
    {
      question: "How many Major Championships has Tiger Woods won?",
      answers: ["5", "12", "18", "15"],
      correctAnswer: "15",
    },
    {
      question:
        "Tiger set the all time cuts made record on the PGA Tour with how many made cuts in a row?",
      answers: ["42", "102", "142", "86"],
      correctAnswer: "142",
    },
    {
      question: "What is Tiger's win percentage in PGA Tour starts?",
      answers: ["12.9%", "22.8%", "5.6%", "31.3%"],
      correctAnswer: "22.8%",
    },
    {
      question: "How many PGA Tour wins has Tiger had in his career?",
      answers: ["82", "67", "53", "91"],
      correctAnswer: "82",
    },
    {
      question: "How many times has Tiger won PGA Tour Player of the Year?",
      answers: ["5", "9", "15", "11"],
      correctAnswer: "11",
    },
  ],
  quizStarted: false,
  currentQuestion: 0,
  score: 0,
};

function generateBeginQuiz() {
  return `
    <div class="begin-quiz">
      <p>Let's see how much you know about Tiger Woods.  Click the button to begin.</p>
      <button type="button" id="begin-btn">Begin</button>
    </div>
  `;
}

function generateNumberAndScore() {
  return `
    <ul class="question-and-score">
      <li id="question-number">
        Question Number: ${store.currentQuestion + 1} of ${
    store.questions.length
  }
      </li>
      <li id="score">
        Score: ${store.score} out of ${store.questions.length}
      </li>
    </ul>
    `;
}

function generateAnswers() {
  const answersArr = store.questions[store.currentQuestion].answers;
  let answersHtml = "";
  let i = 0;

  answersArr.forEach((answer) => {
    answersHtml += `
      <div id="choices-container-${i}">
        <input type="radio" name="choices" id="choices${
          i + 1
        }" value="${answer}" tabindex="${i + 1}" required>
        <label for="choices${i + 1}">${answer}</label>
      </div>
      `;
    i++;
  });
  return answersHtml;
}

function generateQuestion() {
  let currentQuestion = store.questions[store.currentQuestion];
  return `
  <form id='question-form' class='question-form'>
    <fieldset>
      <div class='question'>
        <legend> ${currentQuestion.question}</legend>
      </div>
      <div class='choices'>
        <div class='answers'>
          ${generateAnswers()}
        </div>
      </div>
      <button type='submit' id='submit-answer-btn' tabindex='5'>Submit</button>
      <div class='hide-button'>
        <button type='button' id='next-question-btn' tabindex='6'>Next Question</button>
      </div>
    </fieldset>
  </form>
  `;
}

function generateResults() {
  return `
  <div class='results'>
    <form id='js-results-quiz'>
      <fieldset>
        <div class='row'>
          <div class='col-12'>
            <legend>You Scored: ${store.score} out of ${store.questions.length}</legend>
          </div>
  </div>
  <div class='row'>
    <div class='col-12'>
      <button type='button' id='restart'>Restart Quiz</button>
    </div>
  </div>
  </fieldset>
  </form>
  </div>
  `;
}

function generateFeedback(answerStatus) {
  let correctAnswer = store.questions[store.currentQuestion].correctAnswer;
  let html = "";
  if (answerStatus === "correct") {
    html = `<div class='right-answer'>You're Right!</div>`;
  } else if (answerStatus === "incorrect") {
    html = `<div class='wrong-answer'>Sorry, the correct answer is ${correctAnswer}.</div>`;
  }
  return html;
}

function render() {
  let html = "";
  if (store.quizStarted === false) {
    $("main").html(generateBeginQuiz());
    return;
  } else if (
    store.currentQuestion >= 0 &&
    store.currentQuestion < store.questions.length
  ) {
    html = generateNumberAndScore();
    html += generateQuestion();
    $("main").html(html);
  } else {
    $("main").html(generateResults());
  }
}

function handleBeginClick() {
  $("main").on("click", "#begin-btn", function (event) {
    store.quizStarted = true;
    render();
  });
}

function handleNextQuestionClick() {
  $("main").on("click", "#next-question-btn", (event) => {
    render();
  });
}

function handleQuestionSubmit() {
  $("main").on("submit", "#question-form", function (event) {
    event.preventDefault();
    const currentQuestion = store.questions[store.currentQuestion];
    let selectedChoice = $("input[name=choices]:checked").val();
    let choiceContainerId = `#choices-container-${currentQuestion.answers.findIndex(
      (i) => i === selectedChoice
    )}`;
    if (selectedChoice === currentQuestion.correctAnswer) {
      store.score++;
      $(choiceContainerId).append(generateFeedback("correct"));
    } else {
      $(choiceContainerId).append(generateFeedback("incorrect"));
    }
    store.currentQuestion++;
    $("#submit-answer-btn").hide();
    $("input[type=radio]").each(() => {
      $("input[type=radio]").attr("disabled", true);
    });
    $(".hide-button").show();
  });
}

function restartQuiz() {
  store.quizStarted = false;
  store.currentQuestion = 0;
  store.score = 0;
}

function handleResartClick() {
  $("main").on("click", "#restart", () => {
    restartQuiz();
    render();
  });
}

function handleQuizApp() {
  render();
  handleBeginClick();
  handleNextQuestionClick();
  handleQuestionSubmit();
  handleResartClick();
}

$(handleQuizApp);
