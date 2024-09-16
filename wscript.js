document.addEventListener("DOMContentLoaded", function() {
  let questionInterval;

  function generateMathProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const sum = num1 + num2;

    const userAnswer = prompt(`What is ${num1} + ${num2}?`);
    return parseInt(userAnswer) === sum;
  }

  function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = `${Math.random() * 100}%`;
    document.querySelector('.sparkles').appendChild(sparkle);

    // Remove sparkle after animation ends
    sparkle.addEventListener('animationend', () => sparkle.remove());
  }

  function showSparkles() {
    document.querySelector('.sparkles').style.display = 'block';
    for (let i = 0; i < 100; i++) {
      setTimeout(createSparkle, i * 100); // Stagger the creation of sparkles
    }
    setTimeout(() => {
      document.querySelector('.sparkles').style.display = 'none';
    }, 3000); // Hide sparkles container after some time
  }

  function updateBoyAnimation(answerIsCorrect) {
    const boyElement = document.querySelector('.boy');
    const jumpingElement = document.querySelector('.boy-jumping-with-joy');
    const fellDownElement = document.querySelector('.boy-fell-down');
    const messageElement = document.querySelector('.message');
    const backgroundElement = document.querySelector('.background');

    backgroundElement.style.animationPlayState = 'paused'; // Pause background animation

    if (answerIsCorrect) {
      boyElement.style.display = 'none';
      jumpingElement.style.display = 'block';
      fellDownElement.style.display = 'none';
      messageElement.textContent = "Correct! Well done!";
      messageElement.classList.add('correct');
      messageElement.classList.remove('incorrect');
      showSparkles(); // Show sparkles when answer is correct
    } else {
      boyElement.style.display = 'none';
      jumpingElement.style.display = 'none';
      fellDownElement.style.display = 'block';
      messageElement.textContent = "Oops! Try again.";
      messageElement.classList.add('incorrect');
      messageElement.classList.remove('correct');
    }
  }

  function resetScene() {
    document.querySelector('.boy-jumping-with-joy').style.display = 'none';
    document.querySelector('.boy-fell-down').style.display = 'none';
    document.querySelector('.boy').style.display = 'block';
    document.querySelector('.message').textContent = '';
    document.querySelector('.message').classList.remove('correct', 'incorrect');
    document.querySelector('.background').style.animationPlayState = 'running'; // Resume background animation
  }

  function handleQuestion() {
    const answerIsCorrect = generateMathProblem();
    updateBoyAnimation(answerIsCorrect);

    setTimeout(() => {
      resetScene();
    }, 4000); // 4 seconds delay for animations and feedback
  }

  function startQuestionInterval() {
    handleQuestion(); // Initial question
    questionInterval = setInterval(() => {
      handleQuestion();
    }, 10000); // Ask a new question every 10 seconds
  }

  function stopQuestionInterval() {
    clearInterval(questionInterval);
  }

  startQuestionInterval();

  // You may want to stop the interval when certain conditions are met
  // Example:
  // stopQuestionInterval();
});
