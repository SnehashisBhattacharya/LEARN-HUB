const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const currentFruitElement = document.getElementById('currentFruit');

        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        let snake = [{ x: 10, y: 10 }];
        let dx = 0;
        let dy = 0;
        let food = { x: 15, y: 15 };
        let score = 0;

        const fruits = [
            { name: 'Apple', emoji: '🍎' },
            { name: 'Banana', emoji: '🍌' },
            { name: 'Cherry', emoji: '🍒' },
            { name: 'Grapes', emoji: '🍇' },
            { name: 'Lemon', emoji: '🍋' },
            { name: 'Orange', emoji: '🍊' },
            { name: 'Pear', emoji: '🍐' },
            { name: 'Strawberry', emoji: '🍓' }
        ];
        let currentFruitIndex = 0;

        function drawGame() {
            clearCanvas();
            moveSnake();
            drawSnake();
            drawFood();
            checkCollision();
            updateScore();
            setTimeout(drawGame, 400);
        }

        function clearCanvas() {
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function moveSnake() {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                score++;
                generateFood();
                currentFruitIndex = (currentFruitIndex + 1) % fruits.length;
                currentFruitElement.textContent = `${fruits[currentFruitIndex].emoji} ${fruits[currentFruitIndex].name}`;
            } else {
                snake.pop();
            }
        }

        function drawSnake() {
            // Draw wavy body
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = gridSize - 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2);

            for (let i = 1; i < snake.length; i++) {
                const segment = snake[i];
                const prevSegment = snake[i - 1];
                
                // Calculate control points for the curve
                const cp1x = prevSegment.x * gridSize + gridSize / 2;
                const cp1y = prevSegment.y * gridSize + gridSize / 2;
                const cp2x = segment.x * gridSize + gridSize / 2;
                const cp2y = segment.y * gridSize + gridSize / 2;
                
                // Draw a curved line between segments
                ctx.quadraticCurveTo(cp1x, cp1y, (cp1x + cp2x) / 2, (cp1y + cp2y) / 2);
            }

            ctx.stroke();

            // Draw head
            const head = snake[0];
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath();
            ctx.arc(head.x * gridSize + gridSize / 2, head.y * gridSize + gridSize / 2, gridSize / 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // Draw eyes
            ctx.fillStyle = 'white';
            const eyeOffset = 3;
            const eyeSize = 4;
            const pupilSize = 2;

            // Left eye
            ctx.beginPath();
            const leftEyeX = head.x * gridSize + gridSize / 2 - eyeOffset + (dx * 3);
            const leftEyeY = head.y * gridSize + gridSize / 2 - eyeOffset + (dy * 3);
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, 2 * Math.PI);
            ctx.fill();

            // Right eye
            ctx.beginPath();
            const rightEyeX = head.x * gridSize + gridSize / 2 + eyeOffset + (dx * 3);
            const rightEyeY = head.y * gridSize + gridSize / 2 - eyeOffset + (dy * 3);
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, 2 * Math.PI);
            ctx.fill();

            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(leftEyeX + dx, leftEyeY + dy, pupilSize, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(rightEyeX + dx, rightEyeY + dy, pupilSize, 0, 2 * Math.PI);
            ctx.fill();
        }

        function drawFood() {
            ctx.font = `${gridSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                fruits[currentFruitIndex].emoji,
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2
            );
        }

        function generateFood() {
            food.x = Math.floor(Math.random() * tileCount);
            food.y = Math.floor(Math.random() * tileCount);
        }

        function checkCollision() {
            if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
                resetGame();
            }
            for (let i = 1; i < snake.length; i++) {
                if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                    resetGame();
                }
            }
        }

        function resetGame() {
            alert('Game Over! Your score: ' + score);
            snake = [{ x: 10, y: 10 }];
            dx = 0;
            dy = 0;
            score = 0;
            currentFruitIndex = 0;
            generateFood();
            currentFruitElement.textContent = `${fruits[currentFruitIndex].emoji} ${fruits[currentFruitIndex].name}`;
        }

        function updateScore() {
            scoreElement.textContent = score;
        }

        function changeDirection(newDx, newDy) {
            if ((newDx === 1 && dx === -1) || (newDx === -1 && dx === 1) ||
                (newDy === 1 && dy === -1) || (newDy === -1 && dy === 1)) {
                return; // Prevent 180-degree turns
            }
            dx = newDx;
            dy = newDy;
        }

        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    changeDirection(0, -1);
                    break;
                case 'ArrowDown':
                    changeDirection(0, 1);
                    break;
                case 'ArrowLeft':
                    changeDirection(-1, 0);
                    break;
                case 'ArrowRight':
                    changeDirection(1, 0);
                    break;
            }
        });

        // Touch controls
        document.getElementById('upBtn').addEventListener('click', () => changeDirection(0, -1));
        document.getElementById('downBtn').addEventListener('click', () => changeDirection(0, 1));
        document.getElementById('leftBtn').addEventListener('click', () => changeDirection(-1, 0));
        document.getElementById('rightBtn').addEventListener('click', () => changeDirection(1, 0));

        currentFruitElement.textContent = `${fruits[currentFruitIndex].emoji} ${fruits[currentFruitIndex].name}`;
        drawGame();