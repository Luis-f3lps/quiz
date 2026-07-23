let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionCounterText = document.getElementById('question-counter');
const scoreCounterText = document.getElementById('score-counter');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const feedbackBox = document.getElementById('feedback-box');
const feedbackStatus = document.getElementById('feedback-status');
const explanationText = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-btn');

async function loadQuestions() {
  const response = await fetch('/api/questoes');
  questions = await response.json();
  showQuestion();
}

function showQuestion() {
  resetState();
  
  const currentQuestion = questions[currentQuestionIndex];
  questionCounterText.innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
  scoreCounterText.innerText = `Pontuação: ${score}`;
  questionText.innerText = currentQuestion.pergunta;

  currentQuestion.opcoes.forEach((opcao, index) => {
    const button = document.createElement('button');
    button.innerText = opcao;
    button.classList.add('option-btn');
    button.addEventListener('click', () => selectAnswer(index));
    optionsGrid.appendChild(button);
  });
}

function resetState() {
  feedbackBox.classList.add('hidden');
  nextBtn.classList.add('hidden');
  optionsGrid.innerHTML = '';
}

function selectAnswer(selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = optionsGrid.querySelectorAll('.option-btn');
  const isCorrect = selectedIndex === currentQuestion.correta;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === currentQuestion.correta) {
      button.classList.add('correct');
    } else if (index === selectedIndex && !isCorrect) {
      button.classList.add('incorrect');
    }
  });

  feedbackStatus.className = '';
  if (isCorrect) {
    score++;
    scoreCounterText.innerText = `Pontuação: ${score}`;
    feedbackStatus.innerText = 'Resposta Correta!';
    feedbackStatus.classList.add('correct-text');
  } else {
    feedbackStatus.innerText = 'Resposta Incorreta!';
    feedbackStatus.classList.add('incorrect-text');
  }

  explanationText.innerText = currentQuestion.explicacao;
  feedbackBox.classList.remove('hidden');

  if (currentQuestionIndex < questions.length - 1) {
    nextBtn.innerText = 'Próxima Questão';
    nextBtn.classList.remove('hidden');
  } else {
    nextBtn.innerText = 'Reiniciar Quiz';
    nextBtn.classList.remove('hidden');
  }
}

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
  }
});

loadQuestions();