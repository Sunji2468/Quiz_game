let currentQuestion = 0;
let score = 0;
let questions = [];
let selectedOption = null;
let quizCompleted = false;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const feedback = document.getElementById('feedback');
const scoreValue = document.getElementById('score-value');
const totalAnswered = document.getElementById('total-answered');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion(index) {
    if (index >= questions.length) {
        showFinalScore();
        return;
    }

    currentQuestion = index;
    selectedOption = null;
    const question = questions[index];


    currentQuestionSpan.textContent = index + 1;
    questionText.textContent = question.questionText;


    optionsContainer.innerHTML = '';

  
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = i + 1;

        optionElement.addEventListener('click', () => selectOption(optionElement, i + 1));
        optionsContainer.appendChild(optionElement);
    });

    submitBtn.disabled = true;
    submitBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    feedback.textContent = '';
    feedback.className = 'feedback';
}

function selectOption(optionElement, optionIndex) {
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    optionElement.classList.add('selected');
    selectedOption = optionIndex;
    submitBtn.disabled = false;
}

function submitAnswer() {
    if (selectedOption === null) return;

    const correctAnswer = questions[currentQuestion].correctAnswer;
    const options = document.querySelectorAll('.option');

    totalAnswered.textContent = currentQuestion + 1;

    options.forEach((option, index) => {
        const optionIndex = index + 1;
        if (optionIndex === correctAnswer) {
            option.classList.add('correct');
        } else if (optionIndex === selectedOption && selectedOption !== correctAnswer) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });

    if (selectedOption === correctAnswer) {
        feedback.textContent = "Correct! 🎉";
        feedback.className = "feedback correct";
        score++;
        scoreValue.textContent = score;
    } else {
        feedback.textContent = `Wrong! The correct answer was: ${questions[currentQuestion].options[correctAnswer - 1]}`;
        feedback.className = "feedback incorrect";
    }
    submitBtn.style.display = 'none';

    if (currentQuestion + 1 < questions.length) {
        nextBtn.style.display = 'inline-block';
    } else {
        restartBtn.style.display = 'inline-block';
        restartBtn.textContent = 'View Final Score';
    }
}

function showFinalScore() {
    quizCompleted = true;

    const percentage = Math.round((score / questions.length) * 100);
    let message = '';

    if (percentage >= 90) {
        message = '🏆 Excellent!';
    } else if (percentage >= 70) {
        message = '👏 Great job!';
    } else if (percentage >= 50) {
        message = '👍 Good effort!';
    } else {
        message = '💪 Try again!';
    }

    questionText.innerHTML = `<div class="final-score">Quiz Completed!</div>`;
    optionsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 1.5em; margin-bottom: 15px;">
                Your Score: <strong>${score}/${questions.length}</strong> (${percentage}%)
            </div>
            <div style="font-size: 1.2em; color: #666;">
                ${message}
            </div>
        </div>
    `;

    submitBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    restartBtn.textContent = 'Start New Quiz';
    feedback.textContent = '';
    feedback.className = 'feedback';
}

function restartQuiz() {
    if (quizCompleted) {
        initializeQuiz();
    } else {
        showFinalScore();
    }
}

async function initializeQuiz() {
    try {
        const response = await fetch('http://localhost:3001/questions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            questions = data.questions || fallbackQuestions;
        } else {
            throw new Error('Backend not available');
        }
    } catch (error) {
        console.log('Using fallback questions (C++ backend not available)');
        questions = [...fallbackQuestions];
    }

    shuffleArray(questions);
    currentQuestion = 0;
    score = 0;
    quizCompleted = false;
    selectedOption = null;

    totalQuestionsSpan.textContent = questions.length;
    scoreValue.textContent = score;
    totalAnswered.textContent = 0;
    showQuestion(0);
}

submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', () => {
    showQuestion(currentQuestion + 1);
});
restartBtn.addEventListener('click', restartQuiz);
document.addEventListener('DOMContentLoaded', initializeQuiz);