const quizData = [
    {
        question: "What is the capital of France?",
        image: "france-image.jpg",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        image: "mars-image.jpg",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    // Add more questions as needed
];

let currentQuestionIndex = 0;
let userScore = 0;
let timer;
const timerDuration = 10; // Set the timer duration in seconds
let userRank; // Variable to store the user's rank

function startQuiz() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("question-screen").style.display = "block";
    startTimer();
    displayQuestion();
}

function startTimer() {
    let timeLeft = timerDuration;
    updateTimer(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timer);
            checkAnswer(null);
        }
    }, 1000);
}

function updateTimer(timeLeft) {
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
}

function displayQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    document.getElementById("question").innerText = currentQuestion.question;

    // Display the image if available
    if (currentQuestion.image) {
        const imageElement = document.createElement("img");
        imageElement.src = currentQuestion.image;
        imageElement.alt = "Question Image";
        imageElement.style.width = "400px"; // Set the width
        imageElement.style.height = "400px"; // Set the height
        document.getElementById("image-container").innerHTML = ""; // Clear previous image
        document.getElementById("image-container").appendChild(imageElement);
    }

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => {
            clearInterval(timer);
            checkAnswer(option);
        };
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(userAnswer) {
    const currentQuestion = quizData[currentQuestionIndex];

    if (userAnswer === currentQuestion.correctAnswer) {
        userScore++;
    }

    nextQuestion();
}

function nextQuestion() {
    clearInterval(timer);
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        startTimer();
        displayQuestion();
    } else {
        calculateRank();
        showResult();
    }
}

function calculateRank() {
    // Assuming a simple ranking based on the user's score
    const totalScore = quizData.length * 2; // Adjust based on your scoring system
    const percentage = (userScore / totalScore) * 100;

    if (percentage >= 80) {
        userRank = "Excellent";
    } else if (percentage >= 60) {
        userRank = "Good";
    } else if (percentage >= 40) {
        userRank = "Average";
    } else {
        userRank = "Below Average";
    }
}

function showResult() {
    document.getElementById("question-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    document.getElementById("user-score").innerText = `Your Score: ${userScore} / ${quizData.length}`;
    document.getElementById("user-rank").innerText = `Rank: ${userRank}`;

    // Display stored results
    displayResults();
}

async function saveResult() {
    const userName = document.getElementById("user-name").value;

    if (!userName) {
        alert("Please enter your name.");
        return;
    }

    const userResult = {
        name: userName,
        score: userScore,
        rank: userRank,
    };

    try {
        // Send a POST request to the server to add the new result
        const response = await fetch('http://localhost:3000/api/rankings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userResult),
        });

        if (response.ok) {
            console.log('Result added successfully.');
            // Display updated results
            displayResults();
        } else {
            console.error('Failed to add result.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayResults() {
    try {
        // Send a GET request to the server to retrieve rankings
        const response = await fetch('http://localhost:3000/api/rankings');
        if (response.ok) {
            const rankings = await response.json();

            // Display results in the result-screen div
            const resultContainer = document.getElementById("results-container");
            resultContainer.innerHTML = "<h2>Quiz Results</h2>";

            if (rankings.length === 0) {
                resultContainer.innerHTML += "<p>No results yet. Be the first to take the quiz!</p>";
            } else {
                rankings.forEach((result, index) => {
                    resultContainer.innerHTML += `<p>${index + 1}. ${result.name} - Score: ${result.score} / ${quizData.length}, Rank: ${result.rank}</p>`;
                });
            }
        } else {
            console.error('Failed to fetch rankings.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
