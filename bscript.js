const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreSpan = document.getElementById('finalScore');
const mobileInput = document.getElementById('mobileInput');
const message = document.getElementById('message');

const buildings = [];
const bombEmoji = '💣';
const explosionEmoji = '💥';

let bomb = null;
let explosion = null;
let score = 0;
let gameActive = true;

const PADDING = 50; // Padding from the edges of the screen

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function createBomb() {
    return {
        x: PADDING + Math.random() * (canvas.width - 2 * PADDING),
        y: 0,
        letter: randomLetter(),
        speed: 1.0 // Increase this value for faster bombs
    };
}

function drawBuildings() {
    const buildingWidth = (canvas.width - 2 * PADDING) / buildings.length;
    buildings.forEach((building, index) => {
        ctx.font = '40px Arial';
        ctx.fillText(building, PADDING + index * buildingWidth, canvas.height - 10);
    });
}

function drawBomb() {
    if (bomb) {
        ctx.font = 'bold 36px Arial';
        
        // Draw bomb emoji
        ctx.fillText(bombEmoji, bomb.x, bomb.y);
        
        // Draw letter with outline for better visibility
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText(bomb.letter, bomb.x + 40, bomb.y);
        ctx.fillText(bomb.letter, bomb.x + 40, bomb.y);
    }
}

function drawExplosion() {
    if (explosion) {
        const explosionElement = document.createElement('div');
        explosionElement.classList.add('explosion');
        explosionElement.textContent = explosionEmoji;
        explosionElement.style.left = `${explosion.x}px`;
        explosionElement.style.top = `${explosion.y}px`;
        document.body.appendChild(explosionElement);
        
        setTimeout(() => {
            document.body.removeChild(explosionElement);
        }, 500); // Duration of the explosion animation
    }
}

function drawScore() {
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(`Score: ${score}`, PADDING, PADDING);
    ctx.fillText(`Score: ${score}`, PADDING, PADDING);
}

function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing

    drawBuildings();
    drawBomb();
    drawExplosion();
    drawScore();

    if (bomb) {
        bomb.y += bomb.speed;
        
        // Optionally, you can increase the bomb speed over time
        bomb.speed += 0.3; // Increase speed gradually

        if (bomb.y > canvas.height - PADDING) {
            // Trigger explosion before game over
            if (!explosion) { // Trigger explosion only once
                explosion = {
                    x: bomb.x,
                    y: bomb.y,
                    timer: 30 // Keep explosion visible for 30 frames
                };
                bomb = null; // Remove the bomb
                setTimeout(gameOver, 500); // Delay game over to show explosion
            }
        }
    } else if (!explosion) {
        bomb = createBomb();
    }

    if (explosion) {
        explosion.timer--;
        if (explosion.timer <= 0) {
            explosion = null;
        }
    }

    requestAnimationFrame(update);
}

function gameOver() {
    gameActive = false;
    finalScoreSpan.textContent = score;
    gameOverScreen.style.display = 'block';
    message.style.display = 'block'; // Show the message
    mobileInput.blur();
}

function restartGame() {
    score = 0;
    bomb = null;
    explosion = null;
    gameActive = true;
    gameOverScreen.style.display = 'none';
    message.style.display = 'none'; // Hide the message
    mobileInput.focus();
    update();
}

function handleInput(letter) {
    if (!gameActive || !bomb) return;

    if (bomb.letter === letter) {
        // Trigger explosion at the bomb's current position
        explosion = {
            x: bomb.x,
            y: bomb.y,
            timer: 30 // Keep explosion visible for 30 frames
        };
        bomb = null;
        score++;
    }
}

document.addEventListener('keydown', (event) => {
    handleInput(event.key.toUpperCase());
});

mobileInput.addEventListener('input', (event) => {
    handleInput(event.target.value.toUpperCase());
    event.target.value = '';
});

canvas.addEventListener('click', () => {
    mobileInput.focus();
});

// Start the game
mobileInput.focus();
update();
