const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const colorIndicator = document.getElementById("color-indicator");
const restartButton = document.getElementById("restart-button");
const sparklesContainer = document.getElementById("sparkles");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SNAKE_SIZE = 30; // Size of each snake part and food particle

let snake;
let food;
let dx;
let dy;
let changingDirection;
let isPaused;
const colors = ["red", "yellow"];
let currentColorIndex;

const ENTER_KEY = 13; // Key code for Enter key

document.addEventListener("keydown", handleKeyPress);

function startGame() {
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    food = { x: 0, y: 0, color: "red" };
    dx = SNAKE_SIZE;
    dy = 0;
    changingDirection = false;
    isPaused = false;
    currentColorIndex = 0;
    restartButton.style.display = 'none'; // Hide the restart button
    generateFood();
    main();
}

function main() {
    if (didGameEnd()) {
        showGameOver();
        return;
    }

    setTimeout(function onTick() {
        if (!isPaused) {
            changingDirection = false;
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
        }

        // Repeat
        main();
    }, 100);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Ensure it clears the canvas
}

function drawFood() {
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);

    // Draw border around food
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "black"; // Snake color
        ctx.fillRect(part.x, part.y, SNAKE_SIZE, SNAKE_SIZE);

        ctx.strokeStyle = "white"; // Highlight color
        ctx.lineWidth = 3; // Thickness of the highlight
        ctx.strokeRect(part.x, part.y, SNAKE_SIZE, SNAKE_SIZE);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (checkCollision(head, food)) {
        const colorEaten = food.color;
        updateFoodColor();
        generateFood();
        showColorIndicator(colorEaten);
        isPaused = true; // Pause the game
        setTimeout(() => isPaused = false, 5000); // Resume after 5 seconds
    } else {
        snake.pop();
    }
}

function handleKeyPress(event) {
    if (event.keyCode === ENTER_KEY) {
        restartGame(); // Restart the game when Enter is pressed
    } else {
        changeDirection(event); // Handle other key presses
    }
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -SNAKE_SIZE;
    const goingDown = dy === SNAKE_SIZE;
    const goingRight = dx === SNAKE_SIZE;
    const goingLeft = dx === -SNAKE_SIZE;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -SNAKE_SIZE;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -SNAKE_SIZE;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = SNAKE_SIZE;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = SNAKE_SIZE;
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - SNAKE_SIZE;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - SNAKE_SIZE;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function generateFood() {
    food.x = Math.round((Math.random() * (canvas.width - SNAKE_SIZE)) / SNAKE_SIZE) * SNAKE_SIZE;
    food.y = Math.round((Math.random() * (canvas.height - SNAKE_SIZE)) / SNAKE_SIZE) * SNAKE_SIZE;

    // Ensure the food does not generate on the snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) generateFood();
    });

    // Update color for the next food
    currentColorIndex = (currentColorIndex + 1) % colors.length;
}

function updateFoodColor() {
    food.color = colors[currentColorIndex];
}

function showColorIndicator(colorEaten) {
    colorIndicator.innerHTML = `Wow, the color is <span style="color: ${colorEaten};">${colorEaten}</span>`;
    colorIndicator.style.display = 'block';

    // Clear old sparkles before creating new ones
    clearSparkles();
    createSparkles(); // Create sparkles when showing color indicator

    setTimeout(() => {
        colorIndicator.style.display = 'none';
        colorIndicator.innerHTML = ''; // Clear the content
        clearSparkles(); // Clear sparkles after notification is hidden
    }, 5000); // Show for 5 seconds
}

function clearSparkles() {
    // Clear all sparkles from the container
    sparklesContainer.innerHTML = '';
}

function checkCollision(part, food) {
    return part.x < food.x + SNAKE_SIZE &&
           part.x + SNAKE_SIZE > food.x &&
           part.y < food.y + SNAKE_SIZE &&
           part.y + SNAKE_SIZE > food.y;
}

function showGameOver() {
    colorIndicator.style.display = 'none'; // Hide color indicator
    restartButton.style.display = 'block'; // Show restart button
}

function restartGame() {
    restartButton.style.display = 'none'; // Hide restart button
    startGame(); // Restart the game
}

// Function to create sparkles
function createSparkles() {
    for (let i = 0; i < 100; i++) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        
        // Randomize position
        sparkle.style.left = Math.random() * window.innerWidth + "px";
        sparkle.style.top = Math.random() * window.innerHeight + "px";
        
        // Randomize color
        sparkle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
        
        // Append sparkle to the container
        sparklesContainer.appendChild(sparkle);
        
        // Remove sparkle after animation ends
        sparkle.addEventListener("animationend", () => {
            sparkle.remove();
        });
    }
}

// Start the game for the first time
startGame();
function clearCanvas() {
    // Ensure it clears to transparent, or comment out if not needed
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}