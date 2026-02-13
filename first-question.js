// ==========================================
// First Question - Multi-step "No" handling
// ==========================================
const firstQuestion = document.getElementById('firstQuestion');
const firstQuestionText = document.getElementById('firstQuestionText');
const firstQuestionSubtitle = document.getElementById('firstQuestionSubtitle');
const firstYesBtn = document.getElementById('firstYesBtn');
const firstNoBtn = document.getElementById('firstNoBtn');
const questionSection = document.getElementById('questionSection');

let noClickCount = 0;

const noResponses = [
    {
        question: "Think again😞?",
        subtitle: "Life is an incredible journey, and I want to spend every single second of it with you."
    },
    {
        question: "Are You sure 😡?",
        subtitle: "Life is an incredible journey, and I want to spend every single second of it with you."
    },
    {
        question: "See This 🤭",
        subtitle: "Life is an incredible journey, and I want to spend every single second of it with"
    }
];

// First Yes button - Move to Valentine question
firstYesBtn.addEventListener('click', () => {
    firstQuestion.classList.add('hidden');
    questionSection.classList.remove('hidden');
});

// First No button - Change message progressively
firstNoBtn.addEventListener('click', () => {
    if (noClickCount < noResponses.length) {
        firstQuestionText.textContent = noResponses[noClickCount].question;
        firstQuestionSubtitle.textContent = noResponses[noClickCount].subtitle;
        noClickCount++;
    } else {
        // After all "No" attempts, force to Valentine question
        firstQuestion.classList.add('hidden');
        questionSection.classList.remove('hidden');
    }
});
